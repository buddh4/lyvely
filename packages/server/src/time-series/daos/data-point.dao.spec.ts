import { expect } from '@jest/globals';
import { TestingModule } from '@nestjs/testing';
import { createContentTestingModule, getObjectId, TestDataUtils } from '@/test';
import {
  CalendarDateTime,
  CalendarInterval,
  DataPointIntervalFilter,
  dateTime,
  formatDate,
  getFullDayDate,
  toTimingId,
} from '@lyvely/common';
import { TestDataPointDao, TestTimeSeriesContent } from '@/time-series/test';
import { Profile } from '@/profiles';
import { User } from '@/users';
import {
  CheckboxNumberDataPointConfig,
  NumberDataPoint,
  NumberDataPointSchema,
} from '@/time-series';

const DataPointModelDefinition = [
  { name: NumberDataPoint.name, collection: 'testDataPoints', schema: NumberDataPointSchema },
];

describe('NumberDataPointDao', () => {
  let testingModule: TestingModule;
  let testData: TestDataUtils;
  let dao: TestDataPointDao;

  const TEST_KEY = 'NumberDataPointDao';

  beforeEach(async () => {
    testingModule = await createContentTestingModule(
      TEST_KEY,
      [TestDataPointDao],
      DataPointModelDefinition,
    ).compile();
    testData = testingModule.get<TestDataUtils>(TestDataUtils);
    dao = testingModule.get<TestDataPointDao>(TestDataPointDao);
  });

  it('should be defined', () => {
    expect(dao).toBeDefined();
  });

  interface IDataPointTestOptions {
    uid?: string;
    cid?: string;
    pid?: string;
    value?: number;
    locale?: string;
  }

  interface IExtendedPointTestOptions extends IDataPointTestOptions {
    date: CalendarDateTime;
    interval: CalendarInterval;
  }

  async function createEntities(entries: IExtendedPointTestOptions[]) {
    const result = [];
    for (const entry of entries) {
      result.push(createEntity(entry.date, entry.interval, entry));
    }
    return Promise.all(result);
  }

  async function createEntity(
    d: CalendarDateTime,
    interval: CalendarInterval,
    options: IDataPointTestOptions = {},
  ) {
    const date = dateTime(d);
    const user = new User({ _id: getObjectId(options.uid || 'u1') });
    const profile = new Profile(user, {
      _id: getObjectId(options.pid || 'p1'),
      oid: getObjectId(options.pid || 'o1'),
      locale: options.locale || 'de',
    });

    const content = new TestTimeSeriesContent(profile, user, {
      _id: getObjectId(options.uid || 'c1'),
      config: { timeSeries: new CheckboxNumberDataPointConfig({ interval: interval }) },
    });

    const dataPoint = await dao.save(
      new NumberDataPoint(profile, user, content, {
        date: date.toDate(),
        value: options.value ?? 2,
      }),
    );

    return { profile: profile, pid: profile._id, cid: content._id, uid: user._id, date, dataPoint };
  }

  // mongoose.set('debug', true);
  describe('create()', () => {
    it('save data point today', async () => {
      const date = new Date();
      const { dataPoint } = await createEntity(date, CalendarInterval.Daily);
      expect(dataPoint.id).toBeDefined();
      expect(dataPoint.value).toEqual(2);
      expect(dataPoint.tid).toEqual(toTimingId(date));
      expect(dataPoint.date.toISOString()).toEqual(getFullDayDate(date).toISOString());
    });

    it('create data point with timezone', async () => {
      const today = new Date();
      const date = new Date(`${formatDate(today)}T23:00:00.000+08:00`);
      const { dataPoint } = await createEntity(date, CalendarInterval.Daily);
      expect(dataPoint.date.toISOString()).toEqual(`${formatDate(today)}T00:00:00.000Z`);
    });
  });

  describe('updateOneSet()', () => {
    it('update value', async () => {
      const date = new Date('2022-02-20');
      let { dataPoint } = await createEntity(date, CalendarInterval.Daily);
      await dao.updateOneSetById(dataPoint._id, { value: 3 });
      dataPoint = await dao.reload(dataPoint);
      expect(dataPoint.value).toEqual(3);
    });

    it('update interval', async () => {
      const date = new Date('2022-02-20');
      let { dataPoint } = await createEntity(date, CalendarInterval.Daily);
      await dao.updateOneSetById(dataPoint._id, { interval: CalendarInterval.Monthly });
      dataPoint = await dao.reload(dataPoint);
      expect(dataPoint.interval).toEqual(CalendarInterval.Monthly);
    });

    it('assure date is not updatable', async () => {
      const date = new Date('2022-02-20');
      let { dataPoint } = await createEntity(date, CalendarInterval.Daily);
      await dao.updateOneSetById(dataPoint._id, { value: 3, date: new Date() });
      dataPoint = await dao.reload(dataPoint);
      expect(dataPoint.date.toISOString()).toEqual(getFullDayDate(date).toISOString());
    });

    it('assure tid is not updatable', async () => {
      const date = new Date('2022-02-20');
      let { dataPoint } = await createEntity(date, CalendarInterval.Daily);
      await dao.updateOneSetById(dataPoint._id, { value: 3, tid: toTimingId(Date()) });
      dataPoint = await dao.reload(dataPoint);
      expect(dataPoint.tid).toEqual(toTimingId(date));
    });

    it('assure meta pid,uid,cid is not updatable', async () => {
      const date = new Date('2022-02-20');
      const { dataPoint } = await createEntity(date, CalendarInterval.Daily);
      await dao.updateOneSetById(dataPoint._id, {
        value: 3,
        pid: getObjectId('p2'),
        cid: getObjectId('c2'),
        uid: getObjectId('u2'),
      });
      const updated = await dao.reload(dataPoint);
      expect(updated.pid).toEqual(dataPoint.pid);
      expect(updated.cid).toEqual(dataPoint.cid);
      expect(updated.uid).toEqual(dataPoint.uid);
      expect(updated.interval).toEqual(dataPoint.interval);
    });
  });

  describe('daily interval', () => {
    it('find daily data point', async () => {
      const { profile, uid, date } = await createEntity('2022-02-20', CalendarInterval.Daily);
      const result = await dao.findByIntervalLevel(
        profile,
        uid,
        new DataPointIntervalFilter(date.toDate()),
      );
      expect(result.length).toEqual(1);
    });

    it('do not include day after', async () => {
      const { profile, uid, date } = await createEntity('2022-02-20', CalendarInterval.Daily);
      const result = await dao.findByIntervalLevel(
        profile,
        uid,
        new DataPointIntervalFilter(date.add(1, 'days').toDate()),
      );
      expect(result.length).toEqual(0);
    });

    it('do not include day before', async () => {
      const { profile, uid, date } = await createEntity('2022-02-20', CalendarInterval.Daily);
      const result = await dao.findByIntervalLevel(
        profile,
        uid,
        new DataPointIntervalFilter(date.subtract(1, 'days').toDate()),
      );
      expect(result.length).toEqual(0);
    });

    it('do include day if date time level is daily', async () => {
      const { profile, uid, date } = await createEntity('2022-02-20', CalendarInterval.Daily);
      const result = await dao.findByIntervalLevel(
        profile,
        uid,
        new DataPointIntervalFilter(date.toDate(), CalendarInterval.Daily),
      );
      expect(result.length).toEqual(1);
    });
  });

  describe('weekly interval', () => {
    it('find weekly data point', async () => {
      const { profile, uid, date } = await createEntity('2022-02-20', CalendarInterval.Weekly);
      const result = await dao.findByIntervalLevel(
        profile,
        uid,
        new DataPointIntervalFilter(date.toDate()),
      );
      expect(result.length).toEqual(1);
    });

    it('do not include date after', async () => {
      const { profile, uid } = await createEntity('2022-02-20', CalendarInterval.Weekly);
      const result = await dao.findByIntervalLevel(
        profile,
        uid,
        new DataPointIntervalFilter(dateTime('2022-02-13').toDate()),
      );
      expect(result.length).toEqual(0);
    });

    it('do not include date before', async () => {
      // Sunday
      const { profile, uid } = await createEntity('2022-02-20', CalendarInterval.Weekly);

      const result = await dao.findByIntervalLevel(
        profile,
        uid,
        // Monday
        new DataPointIntervalFilter(dateTime('2022-02-21').toDate()),
      );
      expect(result.length).toEqual(0);
    });

    it('do not include if interval level is daily', async () => {
      const { profile, uid, date } = await createEntity('2022-02-20', CalendarInterval.Weekly);
      const result = await dao.findByIntervalLevel(
        profile,
        uid,
        new DataPointIntervalFilter(date.toDate(), CalendarInterval.Daily),
      );
      expect(result.length).toEqual(0);
    });

    it('do include if interval level is weekly', async () => {
      const { profile, uid, date } = await createEntity('2022-02-20', CalendarInterval.Weekly);
      const result = await dao.findByIntervalLevel(
        profile,
        uid,
        new DataPointIntervalFilter(date.toDate(), CalendarInterval.Weekly),
      );
      expect(result.length).toEqual(1);
    });

    it('do include if interval level is monthly', async () => {
      const { profile, uid, date } = await createEntity('2022-02-20', CalendarInterval.Weekly);
      const result = await dao.findByIntervalLevel(
        profile,
        uid,
        new DataPointIntervalFilter(date.toDate(), CalendarInterval.Monthly),
      );
      expect(result.length).toEqual(1);
    });

    it('do include if interval level is quarterly', async () => {
      const { profile, uid, date } = await createEntity('2022-02-20', CalendarInterval.Weekly);
      const result = await dao.findByIntervalLevel(
        profile,
        uid,
        new DataPointIntervalFilter(date.toDate(), CalendarInterval.Quarterly),
      );
      expect(result.length).toEqual(1);
    });

    it('do include if interval level is yearly', async () => {
      const { profile, uid, date } = await createEntity('2022-02-20', CalendarInterval.Weekly);
      const result = await dao.findByIntervalLevel(
        profile,
        uid,
        new DataPointIntervalFilter(date.toDate(), CalendarInterval.Yearly),
      );
      expect(result.length).toEqual(1);
    });

    it('do include if interval level is yearly', async () => {
      const { profile, uid, date } = await createEntity('2022-02-20', CalendarInterval.Weekly);
      const result = await dao.findByIntervalLevel(
        profile,
        uid,
        new DataPointIntervalFilter(date.toDate(), CalendarInterval.Unscheduled),
      );
      expect(result.length).toEqual(1);
    });
  });

  describe('monthly interval', () => {
    it('find monthly data point by first day of month', async () => {
      const { profile, uid } = await createEntity('2022-02-20', CalendarInterval.Monthly);
      const result = await dao.findByIntervalLevel(
        profile,
        uid,
        new DataPointIntervalFilter(dateTime('2022-02-01').toDate()),
      );
      expect(result.length).toEqual(1);
    });

    it('find monthly data point by last day of month', async () => {
      const { profile, uid } = await createEntity('2022-02-20', CalendarInterval.Monthly);
      const result = await dao.findByIntervalLevel(
        profile,
        uid,
        new DataPointIntervalFilter(dateTime('2022-02-28').toDate()),
      );
      expect(result.length).toEqual(1);
    });

    it('do not include date after', async () => {
      const { profile, uid } = await createEntity('2022-02-20', CalendarInterval.Monthly);
      const result = await dao.findByIntervalLevel(
        profile,
        uid,
        new DataPointIntervalFilter(dateTime('2022-01-31').toDate()),
      );
      expect(result.length).toEqual(0);
    });

    it('do not include date before', async () => {
      const { profile, uid } = await createEntity('2022-02-20', CalendarInterval.Monthly);
      const result = await dao.findByIntervalLevel(
        profile,
        uid,
        new DataPointIntervalFilter(dateTime('2022-03-01').toDate()),
      );
      expect(result.length).toEqual(0);
    });

    it('do not include if interval level is daily', async () => {
      const { profile, uid, date } = await createEntity('2022-02-20', CalendarInterval.Monthly);
      const result = await dao.findByIntervalLevel(
        profile,
        uid,
        new DataPointIntervalFilter(date.toDate(), CalendarInterval.Daily),
      );
      expect(result.length).toEqual(0);
    });

    it('do not include if interval level is weekly', async () => {
      const { profile, uid, date } = await createEntity('2022-02-20', CalendarInterval.Monthly);
      const result = await dao.findByIntervalLevel(
        profile,
        uid,
        new DataPointIntervalFilter(date.toDate(), CalendarInterval.Weekly),
      );
      expect(result.length).toEqual(0);
    });

    it('do include if interval level is monthly', async () => {
      const { profile, uid, date } = await createEntity('2022-02-20', CalendarInterval.Monthly);
      const result = await dao.findByIntervalLevel(
        profile,
        uid,
        new DataPointIntervalFilter(date.toDate(), CalendarInterval.Monthly),
      );
      expect(result.length).toEqual(1);
    });

    it('do include if interval level is quarterly', async () => {
      const { profile, uid, date } = await createEntity('2022-02-20', CalendarInterval.Monthly);
      const result = await dao.findByIntervalLevel(
        profile,
        uid,
        new DataPointIntervalFilter(date.toDate(), CalendarInterval.Quarterly),
      );
      expect(result.length).toEqual(1);
    });

    it('do include if interval level is yearly', async () => {
      const { profile, uid, date } = await createEntity('2022-02-20', CalendarInterval.Monthly);
      const result = await dao.findByIntervalLevel(
        profile,
        uid,
        new DataPointIntervalFilter(date.toDate(), CalendarInterval.Yearly),
      );
      expect(result.length).toEqual(1);
    });

    it('do include if interval level is yearly', async () => {
      const { profile, uid, date } = await createEntity('2022-02-20', CalendarInterval.Monthly);
      const result = await dao.findByIntervalLevel(
        profile,
        uid,
        new DataPointIntervalFilter(date.toDate(), CalendarInterval.Unscheduled),
      );
      expect(result.length).toEqual(1);
    });
  });

  describe('quarterly interval', () => {
    it('find quarterly data point by first day of quarter', async () => {
      const { profile, uid } = await createEntity('2022-02-20', CalendarInterval.Quarterly);
      const result = await dao.findByIntervalLevel(
        profile,
        uid,
        new DataPointIntervalFilter(dateTime('2022-01-01').toDate()),
      );
      expect(result.length).toEqual(1);
    });

    it('find quarterly data point by first day of quarter', async () => {
      const { profile, uid } = await createEntity('2022-02-20', CalendarInterval.Quarterly);
      const result = await dao.findByIntervalLevel(
        profile,
        uid,
        new DataPointIntervalFilter(dateTime('2022-03-31').toDate()),
      );
      expect(result.length).toEqual(1);
    });

    it('do not include date after', async () => {
      const { profile, uid } = await createEntity('2022-04-01', CalendarInterval.Quarterly);
      const result = await dao.findByIntervalLevel(
        profile,
        uid,
        new DataPointIntervalFilter(dateTime('2022-03-31').toDate()),
      );
      expect(result.length).toEqual(0);
    });

    it('do not include date before', async () => {
      const { profile, uid } = await createEntity('2022-02-20', CalendarInterval.Quarterly);
      const result = await dao.findByIntervalLevel(
        profile,
        uid,
        new DataPointIntervalFilter(dateTime('2022-07-01').toDate()),
      );
      expect(result.length).toEqual(0);
    });

    it('do not include if interval level is daily', async () => {
      const { profile, uid, date } = await createEntity('2022-02-20', CalendarInterval.Quarterly);
      const result = await dao.findByIntervalLevel(
        profile,
        uid,
        new DataPointIntervalFilter(date.toDate(), CalendarInterval.Daily),
      );
      expect(result.length).toEqual(0);
    });

    it('do not include if interval level is weekly', async () => {
      const { profile, uid, date } = await createEntity('2022-02-20', CalendarInterval.Quarterly);
      const result = await dao.findByIntervalLevel(
        profile,
        uid,
        new DataPointIntervalFilter(date.toDate(), CalendarInterval.Weekly),
      );
      expect(result.length).toEqual(0);
    });

    it('do not include if interval level is monthly', async () => {
      const { profile, uid, date } = await createEntity('2022-02-20', CalendarInterval.Quarterly);
      const result = await dao.findByIntervalLevel(
        profile,
        uid,
        new DataPointIntervalFilter(date.toDate(), CalendarInterval.Monthly),
      );
      expect(result.length).toEqual(0);
    });

    it('do include if interval level is quarterly', async () => {
      const { profile, uid, date } = await createEntity('2022-02-20', CalendarInterval.Quarterly);
      const result = await dao.findByIntervalLevel(
        profile,
        uid,
        new DataPointIntervalFilter(date.toDate(), CalendarInterval.Quarterly),
      );
      expect(result.length).toEqual(1);
    });

    it('do include if interval level is yearly', async () => {
      const { profile, uid, date } = await createEntity('2022-02-20', CalendarInterval.Quarterly);
      const result = await dao.findByIntervalLevel(
        profile,
        uid,
        new DataPointIntervalFilter(date.toDate(), CalendarInterval.Yearly),
      );
      expect(result.length).toEqual(1);
    });

    it('do include if interval level is yearly', async () => {
      const { profile, uid, date } = await createEntity('2022-02-20', CalendarInterval.Quarterly);
      const result = await dao.findByIntervalLevel(
        profile,
        uid,
        new DataPointIntervalFilter(date.toDate(), CalendarInterval.Unscheduled),
      );
      expect(result.length).toEqual(1);
    });
  });

  describe('yearly interval', () => {
    it('find yearly data point by first day of year', async () => {
      const { profile, uid } = await createEntity('2022-02-20', CalendarInterval.Yearly);
      const result = await dao.findByIntervalLevel(
        profile,
        uid,
        new DataPointIntervalFilter(dateTime('2022-01-01').toDate()),
      );
      expect(result.length).toEqual(1);
    });

    it('find yearly data point by first day of year', async () => {
      const { profile, uid } = await createEntity('2022-02-20', CalendarInterval.Yearly);
      const result = await dao.findByIntervalLevel(
        profile,
        uid,
        new DataPointIntervalFilter(dateTime('2022-12-31').toDate()),
      );
      expect(result.length).toEqual(1);
    });

    it('do not include date after', async () => {
      const { profile, uid } = await createEntity('2022-04-01', CalendarInterval.Yearly);
      const result = await dao.findByIntervalLevel(
        profile,
        uid,
        new DataPointIntervalFilter(dateTime('2023-01-01').toDate()),
      );
      expect(result.length).toEqual(0);
    });

    it('do not include date before', async () => {
      const { profile, uid } = await createEntity('2022-02-20', CalendarInterval.Yearly);
      const result = await dao.findByIntervalLevel(
        profile,
        uid,
        new DataPointIntervalFilter(dateTime('2021-12-31').toDate()),
      );
      expect(result.length).toEqual(0);
    });

    it('do not include if interval level is daily', async () => {
      const { profile, uid, date } = await createEntity('2022-02-20', CalendarInterval.Yearly);
      const result = await dao.findByIntervalLevel(
        profile,
        uid,
        new DataPointIntervalFilter(date.toDate(), CalendarInterval.Daily),
      );
      expect(result.length).toEqual(0);
    });

    it('do not include if interval level is weekly', async () => {
      const { profile, uid, date } = await createEntity('2022-02-20', CalendarInterval.Yearly);
      const result = await dao.findByIntervalLevel(
        profile,
        uid,
        new DataPointIntervalFilter(date.toDate(), CalendarInterval.Weekly),
      );
      expect(result.length).toEqual(0);
    });

    it('do not include if interval level is monthly', async () => {
      const { profile, uid, date } = await createEntity('2022-02-20', CalendarInterval.Yearly);
      const result = await dao.findByIntervalLevel(
        profile,
        uid,
        new DataPointIntervalFilter(date.toDate(), CalendarInterval.Monthly),
      );
      expect(result.length).toEqual(0);
    });

    it('do not include if interval level is quarterly', async () => {
      const { profile, uid, date } = await createEntity('2022-02-20', CalendarInterval.Yearly);
      const result = await dao.findByIntervalLevel(
        profile,
        uid,
        new DataPointIntervalFilter(date.toDate(), CalendarInterval.Quarterly),
      );
      expect(result.length).toEqual(0);
    });

    it('do include if interval level is yearly', async () => {
      const { profile, uid, date } = await createEntity('2022-02-20', CalendarInterval.Yearly);
      const result = await dao.findByIntervalLevel(
        profile,
        uid,
        new DataPointIntervalFilter(date.toDate(), CalendarInterval.Yearly),
      );
      expect(result.length).toEqual(1);
    });

    it('do include if interval level is yearly', async () => {
      const { profile, uid, date } = await createEntity('2022-02-20', CalendarInterval.Yearly);
      const result = await dao.findByIntervalLevel(
        profile,
        uid,
        new DataPointIntervalFilter(date.toDate(), CalendarInterval.Unscheduled),
      );
      expect(result.length).toEqual(1);
    });
  });

  describe('unscheduled interval', () => {
    it('include unscheduled data point for past search date', async () => {
      const { profile, uid } = await createEntity('2022-02-20', CalendarInterval.Unscheduled);
      const result = await dao.findByIntervalLevel(
        profile,
        uid,
        new DataPointIntervalFilter(dateTime('1998-01-01').toDate()),
      );
      expect(result.length).toEqual(1);
    });

    it('include unscheduled data point for future search date', async () => {
      const { profile, uid } = await createEntity('2022-02-20', CalendarInterval.Unscheduled);
      const result = await dao.findByIntervalLevel(
        profile,
        uid,
        new DataPointIntervalFilter(dateTime().add(5, 'years').toDate()),
      );
      expect(result.length).toEqual(1);
    });

    it('do not include if interval level is daily', async () => {
      const { profile, uid, date } = await createEntity('2022-02-20', CalendarInterval.Unscheduled);
      const result = await dao.findByIntervalLevel(
        profile,
        uid,
        new DataPointIntervalFilter(date.toDate(), CalendarInterval.Daily),
      );
      expect(result.length).toEqual(0);
    });

    it('do not include if interval level is weekly', async () => {
      const { profile, uid, date } = await createEntity('2022-02-20', CalendarInterval.Unscheduled);
      const result = await dao.findByIntervalLevel(
        profile,
        uid,
        new DataPointIntervalFilter(date.toDate(), CalendarInterval.Weekly),
      );
      expect(result.length).toEqual(0);
    });

    it('do not include if interval level is monthly', async () => {
      const { profile, uid, date } = await createEntity('2022-02-20', CalendarInterval.Unscheduled);
      const result = await dao.findByIntervalLevel(
        profile,
        uid,
        new DataPointIntervalFilter(date.toDate(), CalendarInterval.Monthly),
      );
      expect(result.length).toEqual(0);
    });

    it('do not include if interval level is quarterly', async () => {
      const { profile, uid, date } = await createEntity('2022-02-20', CalendarInterval.Unscheduled);
      const result = await dao.findByIntervalLevel(
        profile,
        uid,
        new DataPointIntervalFilter(date.toDate(), CalendarInterval.Quarterly),
      );
      expect(result.length).toEqual(0);
    });

    it('do not include if interval level is yearly', async () => {
      const { profile, uid, date } = await createEntity('2022-02-20', CalendarInterval.Unscheduled);
      const result = await dao.findByIntervalLevel(
        profile,
        uid,
        new DataPointIntervalFilter(date.toDate(), CalendarInterval.Yearly),
      );
      expect(result.length).toEqual(0);
    });

    it('do include if interval level is yearly', async () => {
      const { profile, uid, date } = await createEntity('2022-02-20', CalendarInterval.Unscheduled);
      const result = await dao.findByIntervalLevel(
        profile,
        uid,
        new DataPointIntervalFilter(date.toDate(), CalendarInterval.Unscheduled),
      );
      expect(result.length).toEqual(1);
    });
  });

  describe('mixed intervals', () => {
    it('find mixed entries', async () => {
      const entries = await createEntities([
        { date: '2022-02-20', interval: CalendarInterval.Daily },
        { date: '2022-02-14', interval: CalendarInterval.Weekly },
        { date: '2022-02-28', interval: CalendarInterval.Monthly },
        { date: '2022-01-20', interval: CalendarInterval.Quarterly },
        { date: '2022-12-31', interval: CalendarInterval.Yearly },
      ]);

      const { profile, uid } = entries[0];
      const result = await dao.findByIntervalLevel(
        profile,
        uid,
        new DataPointIntervalFilter(dateTime('2022-02-20').toDate()),
      );
      expect(result.length).toEqual(5);
    });
  });

  // TODO: Test change content interval (align intervals of data point buckets)
  // TODO: Test different locales (weekofyear translation)
  // TODO: Test cid access
});

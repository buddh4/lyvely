import { getObjectId, ILyvelyTestingModule } from '@lyvely/api';
import {
  CheckboxNumberDataPointConfig,
  DataPointValueType,
  getDataPointModelDefinition,
  NumberDataPoint,
} from '../index';
import { CalendarPlanFilter } from '@lyvely/calendar-plan';
import {
  CalendarDateTime,
  CalendarInterval,
  dateTime,
  formatDate,
  toTimingId,
  useDayJsLocaleManager,
  getFullDayUTCDate,
} from '@lyvely/dates';
import { TestDataPointDao, TestTimeSeriesContent } from '../testing';
import { Profile, User, buildContentTest } from '@lyvely/api';

const DataPointModelDefinition = [
  getDataPointModelDefinition(TestTimeSeriesContent.name, [DataPointValueType.Number]),
];

describe('DataPointDao', () => {
  let testingModule: ILyvelyTestingModule;
  let dao: TestDataPointDao;

  const TEST_KEY = 'DataPointDao';

  beforeEach(async () => {
    testingModule = await buildContentTest(TEST_KEY)
      .providers([TestDataPointDao])
      .models(DataPointModelDefinition)
      .compile();
    dao = testingModule.get(TestDataPointDao);
  });

  afterEach(async () => {
    return testingModule.afterEach();
  });

  afterAll(async () => {
    return testingModule.afterAll();
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
    const result: ReturnType<typeof createEntity>[] = [];
    for (const entry of entries) {
      result.push(createEntity(entry.date, entry.interval, entry));
    }
    return Promise.all(result);
  }

  async function createEntity(
    d: CalendarDateTime,
    interval: CalendarInterval,
    options: IDataPointTestOptions = {}
  ) {
    const date = dateTime(d);
    const user = new User({ _id: getObjectId(options.uid || 'u1') });
    const profile = new Profile(user, {
      _id: getObjectId(options.pid || 'p1'),
      oid: getObjectId(options.pid || 'o1'),
      locale: options.locale || 'de',
    });

    const content = new TestTimeSeriesContent(
      { profile, user },
      {
        _id: getObjectId(options.uid || 'c1'),
        config: { timeSeries: new CheckboxNumberDataPointConfig({ interval: interval }) },
      }
    );

    const dataPoint = await dao.save(
      new NumberDataPoint(profile, user, content, {
        date: date.toDate(),
        value: options.value ?? 2,
      })
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
      expect(dataPoint.date.toISOString()).toEqual(getFullDayUTCDate(date).toISOString());
    });

    it('create data point with timezone', async () => {
      const today = new Date();
      const date = new Date(`${formatDate(today)}T23:00:00.000+08:00`);
      const { dataPoint } = await createEntity(date, CalendarInterval.Daily);
      expect(dataPoint.date.toISOString()).toEqual(`${formatDate(today)}T00:00:00.000Z`);
    });
  });

  describe('updateDataPointValue()', () => {
    it('update value', async () => {
      const date = new Date('2022-02-20');
      // eslint-disable-next-line prefer-const
      const { dataPoint, uid } = await createEntity(date, CalendarInterval.Daily);
      await dao.updateDataPointValue(uid, dataPoint, 3);
      const updated = await dao.reload(dataPoint);
      expect(updated!.value).toEqual(3);
    });
  });

  describe('updateOneSetById()', () => {
    it('update value', async () => {
      const date = new Date('2022-02-20');
      const { dataPoint } = await createEntity(date, CalendarInterval.Daily);
      await dao.updateOneSetById(
        dataPoint._id,
        { value: 3 },
        { discriminator: NumberDataPoint.name }
      );
      const updated = await dao.reload(dataPoint);
      expect(updated!.value).toEqual(3);
    });

    it('update interval', async () => {
      const date = new Date('2022-02-20');
      const { dataPoint } = await createEntity(date, CalendarInterval.Daily);
      await dao.updateOneSetById(dataPoint._id, { interval: CalendarInterval.Monthly });
      const updated = await dao.reload(dataPoint);
      expect(updated!.interval).toEqual(CalendarInterval.Monthly);
    });

    it('assure date is not updatable', async () => {
      const date = new Date('2022-02-20');
      const { dataPoint } = await createEntity(date, CalendarInterval.Daily);
      await dao.updateOneSetById(dataPoint._id, { value: 3, date: new Date() });
      const updated = await dao.reload(dataPoint);
      expect(updated!.date.toISOString()).toEqual(getFullDayUTCDate(date).toISOString());
    });

    it('assure tid is not updatable', async () => {
      const date = new Date('2022-02-20');
      const { dataPoint } = await createEntity(date, CalendarInterval.Daily);
      await dao.updateOneSetById(dataPoint._id, { value: 3, tid: toTimingId(Date()) });
      const updated = await dao.reload(dataPoint);
      expect(updated!.tid).toEqual(toTimingId(date));
    });

    it('assure pid,uid,cid is not updatable', async () => {
      const date = new Date('2022-02-20');
      const { dataPoint } = await createEntity(date, CalendarInterval.Daily);
      await dao.updateOneSetById(dataPoint._id, {
        value: 3,
        pid: getObjectId('p2'),
        cid: getObjectId('c2'),
        uid: getObjectId('u2'),
      });
      const updated = await dao.reload(dataPoint);
      expect(updated!.pid).toEqual(dataPoint.pid);
      expect(updated!.cid).toEqual(dataPoint.cid);
      expect(updated!.uid).toEqual(dataPoint.uid);
      expect(updated!.interval).toEqual(dataPoint.interval);
    });
  });

  describe('daily interval', () => {
    it('find daily data point', async () => {
      const { profile, uid, date } = await createEntity('2022-02-20', CalendarInterval.Daily);
      const result = await dao.findByIntervalLevel(
        profile,
        uid,
        new CalendarPlanFilter(date.toDate())
      );
      expect(result.length).toEqual(1);
    });

    it('do not include day after', async () => {
      const { profile, uid, date } = await createEntity('2022-02-20', CalendarInterval.Daily);
      const result = await dao.findByIntervalLevel(
        profile,
        uid,
        new CalendarPlanFilter(date.add(1, 'days').toDate())
      );
      expect(result.length).toEqual(0);
    });

    it('do not include day before', async () => {
      const { profile, uid, date } = await createEntity('2022-02-20', CalendarInterval.Daily);
      const result = await dao.findByIntervalLevel(
        profile,
        uid,
        new CalendarPlanFilter(date.subtract(1, 'days').toDate())
      );
      expect(result.length).toEqual(0);
    });

    it('do include day if date time level is daily', async () => {
      const { profile, uid, date } = await createEntity('2022-02-20', CalendarInterval.Daily);
      const result = await dao.findByIntervalLevel(
        profile,
        uid,
        new CalendarPlanFilter(date.toDate(), CalendarInterval.Daily)
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
        new CalendarPlanFilter(date.toDate())
      );
      expect(result.length).toEqual(1);
    });

    it('do not include date after', async () => {
      const { profile, uid } = await createEntity('2022-02-20', CalendarInterval.Weekly);
      const result = await dao.findByIntervalLevel(
        profile,
        uid,
        new CalendarPlanFilter(dateTime('2022-02-13').toDate())
      );
      expect(result.length).toEqual(0);
    });

    it('do not include date before', async () => {
      // Sunday
      const { profile, uid } = await createEntity('2022-02-19', CalendarInterval.Weekly);

      const result = await dao.findByIntervalLevel(
        profile,
        uid,
        // Sunday
        new CalendarPlanFilter(dateTime('2022-02-20').toDate())
      );
      expect(result.length).toEqual(0);
    });

    it('do not include if interval level is daily', async () => {
      const { profile, uid, date } = await createEntity('2022-02-20', CalendarInterval.Weekly);
      const result = await dao.findByIntervalLevel(
        profile,
        uid,
        new CalendarPlanFilter(date.toDate(), CalendarInterval.Daily)
      );
      expect(result.length).toEqual(0);
    });

    it('do include if interval level is weekly', async () => {
      const { profile, uid, date } = await createEntity('2022-02-20', CalendarInterval.Weekly);
      const result = await dao.findByIntervalLevel(
        profile,
        uid,
        new CalendarPlanFilter(date.toDate(), CalendarInterval.Weekly)
      );
      expect(result.length).toEqual(1);
    });

    it('do include if interval level is monthly', async () => {
      const { profile, uid, date } = await createEntity('2022-02-20', CalendarInterval.Weekly);
      const result = await dao.findByIntervalLevel(
        profile,
        uid,
        new CalendarPlanFilter(date.toDate(), CalendarInterval.Monthly)
      );
      expect(result.length).toEqual(1);
    });

    it('do include if interval level is quarterly', async () => {
      const { profile, uid, date } = await createEntity('2022-02-20', CalendarInterval.Weekly);
      const result = await dao.findByIntervalLevel(
        profile,
        uid,
        new CalendarPlanFilter(date.toDate(), CalendarInterval.Quarterly)
      );
      expect(result.length).toEqual(1);
    });

    it('do include if interval level is yearly', async () => {
      const { profile, uid, date } = await createEntity('2022-02-20', CalendarInterval.Weekly);
      const result = await dao.findByIntervalLevel(
        profile,
        uid,
        new CalendarPlanFilter(date.toDate(), CalendarInterval.Yearly)
      );
      expect(result.length).toEqual(1);
    });

    it('do include if interval level is yearly', async () => {
      const { profile, uid, date } = await createEntity('2022-02-20', CalendarInterval.Weekly);
      const result = await dao.findByIntervalLevel(
        profile,
        uid,
        new CalendarPlanFilter(date.toDate(), CalendarInterval.Unscheduled)
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
        new CalendarPlanFilter(dateTime('2022-02-01').toDate())
      );
      expect(result.length).toEqual(1);
    });

    it('find monthly data point by last day of month', async () => {
      const { profile, uid } = await createEntity('2022-02-20', CalendarInterval.Monthly);
      const result = await dao.findByIntervalLevel(
        profile,
        uid,
        new CalendarPlanFilter(dateTime('2022-02-28').toDate())
      );
      expect(result.length).toEqual(1);
    });

    it('do not include date after', async () => {
      const { profile, uid } = await createEntity('2022-02-20', CalendarInterval.Monthly);
      const result = await dao.findByIntervalLevel(
        profile,
        uid,
        new CalendarPlanFilter(dateTime('2022-01-31').toDate())
      );
      expect(result.length).toEqual(0);
    });

    it('do not include date before', async () => {
      const { profile, uid } = await createEntity('2022-02-20', CalendarInterval.Monthly);
      const result = await dao.findByIntervalLevel(
        profile,
        uid,
        new CalendarPlanFilter(dateTime('2022-03-01').toDate())
      );
      expect(result.length).toEqual(0);
    });

    it('do not include if interval level is daily', async () => {
      const { profile, uid, date } = await createEntity('2022-02-20', CalendarInterval.Monthly);
      const result = await dao.findByIntervalLevel(
        profile,
        uid,
        new CalendarPlanFilter(date.toDate(), CalendarInterval.Daily)
      );
      expect(result.length).toEqual(0);
    });

    it('do not include if interval level is weekly', async () => {
      const { profile, uid, date } = await createEntity('2022-02-20', CalendarInterval.Monthly);
      const result = await dao.findByIntervalLevel(
        profile,
        uid,
        new CalendarPlanFilter(date.toDate(), CalendarInterval.Weekly)
      );
      expect(result.length).toEqual(0);
    });

    it('do include if interval level is monthly', async () => {
      const { profile, uid, date } = await createEntity('2022-02-20', CalendarInterval.Monthly);
      const result = await dao.findByIntervalLevel(
        profile,
        uid,
        new CalendarPlanFilter(date.toDate(), CalendarInterval.Monthly)
      );
      expect(result.length).toEqual(1);
    });

    it('do include if interval level is quarterly', async () => {
      const { profile, uid, date } = await createEntity('2022-02-20', CalendarInterval.Monthly);
      const result = await dao.findByIntervalLevel(
        profile,
        uid,
        new CalendarPlanFilter(date.toDate(), CalendarInterval.Quarterly)
      );
      expect(result.length).toEqual(1);
    });

    it('do include if interval level is yearly', async () => {
      const { profile, uid, date } = await createEntity('2022-02-20', CalendarInterval.Monthly);
      const result = await dao.findByIntervalLevel(
        profile,
        uid,
        new CalendarPlanFilter(date.toDate(), CalendarInterval.Yearly)
      );
      expect(result.length).toEqual(1);
    });

    it('do include if interval level is yearly', async () => {
      const { profile, uid, date } = await createEntity('2022-02-20', CalendarInterval.Monthly);
      const result = await dao.findByIntervalLevel(
        profile,
        uid,
        new CalendarPlanFilter(date.toDate(), CalendarInterval.Unscheduled)
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
        new CalendarPlanFilter(dateTime('2022-01-01').toDate())
      );
      expect(result.length).toEqual(1);
    });

    it('find quarterly data point by first day of quarter', async () => {
      const { profile, uid } = await createEntity('2022-02-20', CalendarInterval.Quarterly);
      const result = await dao.findByIntervalLevel(
        profile,
        uid,
        new CalendarPlanFilter(dateTime('2022-03-31').toDate())
      );
      expect(result.length).toEqual(1);
    });

    it('do not include date after', async () => {
      const { profile, uid } = await createEntity('2022-04-01', CalendarInterval.Quarterly);
      const result = await dao.findByIntervalLevel(
        profile,
        uid,
        new CalendarPlanFilter(dateTime('2022-03-31').toDate())
      );
      expect(result.length).toEqual(0);
    });

    it('do not include date before', async () => {
      const { profile, uid } = await createEntity('2022-02-20', CalendarInterval.Quarterly);
      const result = await dao.findByIntervalLevel(
        profile,
        uid,
        new CalendarPlanFilter(dateTime('2022-07-01').toDate())
      );
      expect(result.length).toEqual(0);
    });

    it('do not include if interval level is daily', async () => {
      const { profile, uid, date } = await createEntity('2022-02-20', CalendarInterval.Quarterly);
      const result = await dao.findByIntervalLevel(
        profile,
        uid,
        new CalendarPlanFilter(date.toDate(), CalendarInterval.Daily)
      );
      expect(result.length).toEqual(0);
    });

    it('do not include if interval level is weekly', async () => {
      const { profile, uid, date } = await createEntity('2022-02-20', CalendarInterval.Quarterly);
      const result = await dao.findByIntervalLevel(
        profile,
        uid,
        new CalendarPlanFilter(date.toDate(), CalendarInterval.Weekly)
      );
      expect(result.length).toEqual(0);
    });

    it('do not include if interval level is monthly', async () => {
      const { profile, uid, date } = await createEntity('2022-02-20', CalendarInterval.Quarterly);
      const result = await dao.findByIntervalLevel(
        profile,
        uid,
        new CalendarPlanFilter(date.toDate(), CalendarInterval.Monthly)
      );
      expect(result.length).toEqual(0);
    });

    it('do include if interval level is quarterly', async () => {
      const { profile, uid, date } = await createEntity('2022-02-20', CalendarInterval.Quarterly);
      const result = await dao.findByIntervalLevel(
        profile,
        uid,
        new CalendarPlanFilter(date.toDate(), CalendarInterval.Quarterly)
      );
      expect(result.length).toEqual(1);
    });

    it('do include if interval level is yearly', async () => {
      const { profile, uid, date } = await createEntity('2022-02-20', CalendarInterval.Quarterly);
      const result = await dao.findByIntervalLevel(
        profile,
        uid,
        new CalendarPlanFilter(date.toDate(), CalendarInterval.Yearly)
      );
      expect(result.length).toEqual(1);
    });

    it('do include if interval level is yearly', async () => {
      const { profile, uid, date } = await createEntity('2022-02-20', CalendarInterval.Quarterly);
      const result = await dao.findByIntervalLevel(
        profile,
        uid,
        new CalendarPlanFilter(date.toDate(), CalendarInterval.Unscheduled)
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
        new CalendarPlanFilter(dateTime('2022-01-01').toDate())
      );
      expect(result.length).toEqual(1);
    });

    it('find yearly data point by first day of year', async () => {
      const { profile, uid } = await createEntity('2022-02-20', CalendarInterval.Yearly);
      const result = await dao.findByIntervalLevel(
        profile,
        uid,
        new CalendarPlanFilter(dateTime('2022-12-31').toDate())
      );
      expect(result.length).toEqual(1);
    });

    it('do not include date after', async () => {
      const { profile, uid } = await createEntity('2022-04-01', CalendarInterval.Yearly);
      const result = await dao.findByIntervalLevel(
        profile,
        uid,
        new CalendarPlanFilter(dateTime('2023-01-01').toDate())
      );
      expect(result.length).toEqual(0);
    });

    it('do not include date before', async () => {
      const { profile, uid } = await createEntity('2022-02-20', CalendarInterval.Yearly);
      const result = await dao.findByIntervalLevel(
        profile,
        uid,
        new CalendarPlanFilter(dateTime('2021-12-31').toDate())
      );
      expect(result.length).toEqual(0);
    });

    it('do not include if interval level is daily', async () => {
      const { profile, uid, date } = await createEntity('2022-02-20', CalendarInterval.Yearly);
      const result = await dao.findByIntervalLevel(
        profile,
        uid,
        new CalendarPlanFilter(date.toDate(), CalendarInterval.Daily)
      );
      expect(result.length).toEqual(0);
    });

    it('do not include if interval level is weekly', async () => {
      const { profile, uid, date } = await createEntity('2022-02-20', CalendarInterval.Yearly);
      const result = await dao.findByIntervalLevel(
        profile,
        uid,
        new CalendarPlanFilter(date.toDate(), CalendarInterval.Weekly)
      );
      expect(result.length).toEqual(0);
    });

    it('do not include if interval level is monthly', async () => {
      const { profile, uid, date } = await createEntity('2022-02-20', CalendarInterval.Yearly);
      const result = await dao.findByIntervalLevel(
        profile,
        uid,
        new CalendarPlanFilter(date.toDate(), CalendarInterval.Monthly)
      );
      expect(result.length).toEqual(0);
    });

    it('do not include if interval level is quarterly', async () => {
      const { profile, uid, date } = await createEntity('2022-02-20', CalendarInterval.Yearly);
      const result = await dao.findByIntervalLevel(
        profile,
        uid,
        new CalendarPlanFilter(date.toDate(), CalendarInterval.Quarterly)
      );
      expect(result.length).toEqual(0);
    });

    it('do include if interval level is yearly', async () => {
      const { profile, uid, date } = await createEntity('2022-02-20', CalendarInterval.Yearly);
      const result = await dao.findByIntervalLevel(
        profile,
        uid,
        new CalendarPlanFilter(date.toDate(), CalendarInterval.Yearly)
      );
      expect(result.length).toEqual(1);
    });

    it('do include if interval level is yearly', async () => {
      const { profile, uid, date } = await createEntity('2022-02-20', CalendarInterval.Yearly);
      const result = await dao.findByIntervalLevel(
        profile,
        uid,
        new CalendarPlanFilter(date.toDate(), CalendarInterval.Unscheduled)
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
        new CalendarPlanFilter(dateTime('1998-01-01').toDate())
      );
      expect(result.length).toEqual(1);
    });

    it('include unscheduled data point for future search date', async () => {
      const { profile, uid } = await createEntity('2022-02-20', CalendarInterval.Unscheduled);
      const result = await dao.findByIntervalLevel(
        profile,
        uid,
        new CalendarPlanFilter(dateTime().add(5, 'years').toDate())
      );
      expect(result.length).toEqual(1);
    });

    it('do not include if interval level is daily', async () => {
      const { profile, uid, date } = await createEntity('2022-02-20', CalendarInterval.Unscheduled);
      const result = await dao.findByIntervalLevel(
        profile,
        uid,
        new CalendarPlanFilter(date.toDate(), CalendarInterval.Daily)
      );
      expect(result.length).toEqual(0);
    });

    it('do not include if interval level is weekly', async () => {
      const { profile, uid, date } = await createEntity('2022-02-20', CalendarInterval.Unscheduled);
      const result = await dao.findByIntervalLevel(
        profile,
        uid,
        new CalendarPlanFilter(date.toDate(), CalendarInterval.Weekly)
      );
      expect(result.length).toEqual(0);
    });

    it('do not include if interval level is monthly', async () => {
      const { profile, uid, date } = await createEntity('2022-02-20', CalendarInterval.Unscheduled);
      const result = await dao.findByIntervalLevel(
        profile,
        uid,
        new CalendarPlanFilter(date.toDate(), CalendarInterval.Monthly)
      );
      expect(result.length).toEqual(0);
    });

    it('do not include if interval level is quarterly', async () => {
      const { profile, uid, date } = await createEntity('2022-02-20', CalendarInterval.Unscheduled);
      const result = await dao.findByIntervalLevel(
        profile,
        uid,
        new CalendarPlanFilter(date.toDate(), CalendarInterval.Quarterly)
      );
      expect(result.length).toEqual(0);
    });

    it('do not include if interval level is yearly', async () => {
      const { profile, uid, date } = await createEntity('2022-02-20', CalendarInterval.Unscheduled);
      const result = await dao.findByIntervalLevel(
        profile,
        uid,
        new CalendarPlanFilter(date.toDate(), CalendarInterval.Yearly)
      );
      expect(result.length).toEqual(0);
    });

    it('do include if interval level is yearly', async () => {
      const { profile, uid, date } = await createEntity('2022-02-20', CalendarInterval.Unscheduled);
      const result = await dao.findByIntervalLevel(
        profile,
        uid,
        new CalendarPlanFilter(date.toDate(), CalendarInterval.Unscheduled)
      );
      expect(result.length).toEqual(1);
    });
  });

  describe('mixed intervals', () => {
    it('find mixed entries', async () => {
      await useDayJsLocaleManager().loadLocale('de');
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
        new CalendarPlanFilter(dateTime('2022-02-20').toDate())
      );
      expect(result.length).toEqual(5);
    });
  });

  // TODO: Test change content interval (align intervals of data point buckets)
  // TODO: Test different locales (weekofyear translation)
  // TODO: Test cid access
});

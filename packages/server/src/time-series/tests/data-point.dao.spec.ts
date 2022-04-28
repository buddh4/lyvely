import { expect } from '@jest/globals';
import { TestingModule } from '@nestjs/testing';
import { TestDataUtils } from '../../test/utils/test-data.utils';
import { createContentTestingModule, getObjectId } from '../../test/utils/test.utils';
import {
  TestNumberTimingDataPoint,
  TestNumberTimingDataPointPointSchema
} from './src/test-data-point.schema';
import {
  CalendarDateTime,
  CalendarIntervalEnum,
  dateTime,
  formatDate,
  getFullDayDate,
  toTimingId,
  DataPointIntervalFilter } from 'lyvely-common';
import { TestNumberDataPointDao } from './src/test-data-point.dao';

const DataPointModelDefinition = [
  { name: TestNumberTimingDataPoint.name, schema: TestNumberTimingDataPointPointSchema }
];

describe('NumberTimingDataPointDao', () => {
  let testingModule: TestingModule;
  let testData: TestDataUtils;
  let dao: TestNumberDataPointDao;

  const TEST_KEY = 'TimeableContentSchema';

  beforeEach(async () => {
    testingModule = await createContentTestingModule(TEST_KEY, [TestNumberDataPointDao], DataPointModelDefinition).compile();
    testData = testingModule.get<TestDataUtils>(TestDataUtils);
    dao = testingModule.get<TestNumberDataPointDao>(TestNumberDataPointDao);
  });

  afterEach(async () => {
    await dao.deleteAll();
    await testData.reset(TEST_KEY);
  });

  it('should be defined', () => {
    expect(dao).toBeDefined();
  });

  interface DataPointTestOptions {
    uid?: string,
    cid?: string,
    pid?: string,
  }

  interface ExtendedPointTestOptions extends DataPointTestOptions {
    date: CalendarDateTime,
    interval: CalendarIntervalEnum
  }

  async function createEntities(entries: ExtendedPointTestOptions[]) {
    const result = [];
    for(const entry of entries) {
      result.push(createEntity(entry.date, entry.interval, entry));
    }
    return Promise.all(result);
  }

  async function createEntity(d: CalendarDateTime, interval: CalendarIntervalEnum, options: DataPointTestOptions = {}) {
    const date = dateTime(d);
    const pid = getObjectId(options.pid || 'p1');
    const cid = getObjectId(options.cid || 'c1');
    const uid = getObjectId(options.uid || 'u1');

    const dataPoint = await dao.save(new TestNumberTimingDataPoint({
      meta: { pid: pid, cid: cid, interval: interval },
      date: date.toDate(),
      value: 2
    }));

    return { pid, cid, uid, date, dataPoint }
  }

  // mongoose.set('debug', true);
  describe('create()', () => {
    it('save data point today', async () => {
      const date = new Date();
      const { dataPoint } = await createEntity(date, CalendarIntervalEnum.Daily);
      expect(dataPoint.id).toBeDefined();
      expect(dataPoint.tid).toBeDefined();
      expect(dataPoint.value).toEqual(2);
      expect(dataPoint.tid).toEqual(toTimingId(date));
      expect(dataPoint.times?.length).toEqual(1);
      expect(dataPoint.times[0].ts ).toEqual(dateTime(date).unixTs());
      expect(dataPoint.date.toISOString()).toEqual(getFullDayDate(date).toISOString());
    });

    it('timestamp of past events is set to 23:59:59 on the same day', async () => {
      const date = new Date('2022-02-20');
      const { dataPoint } = await createEntity(date, CalendarIntervalEnum.Daily);
      expect(dataPoint.times[0].ts ).toEqual(dateTime(date).time(23, 59, 59).unixTs());
    })

    it('create data point with timezone', async () => {
      const today = new Date();
      const date = new Date(`${formatDate(today)}T23:00:00.000+08:00`);
      const { dataPoint } = await createEntity(date, CalendarIntervalEnum.Daily);
      expect(dataPoint.date.toISOString()).toEqual(`${formatDate(today)}T00:00:00.000Z`);
      expect(dataPoint.times[0].ts).toEqual(dateTime(`${formatDate(today)}T23:00:00.000+08:00`).unixTs());
    })
  });

  describe('updateOneSet()', () => {
    it('update value', async () => {
      const date = new Date('2022-02-20');
      let { dataPoint } = await createEntity(date, CalendarIntervalEnum.Daily);
      await dao.updateOneSet(dataPoint._id, { value: 3 })
      dataPoint = await dao.reload(dataPoint);
      expect(dataPoint.value).toEqual(3);
    });

    it('update interval', async () => {
      const date = new Date('2022-02-20');
      let { dataPoint } = await createEntity(date, CalendarIntervalEnum.Daily);
      await dao.updateOneSet(dataPoint._id, { 'meta.interval' : CalendarIntervalEnum.Monthly })
      dataPoint = await dao.reload(dataPoint);
      expect(dataPoint.meta.interval).toEqual(CalendarIntervalEnum.Monthly );
    });


    it('assure date is not updatable', async () => {
      const date = new Date('2022-02-20');
      let { dataPoint } = await createEntity(date, CalendarIntervalEnum.Daily);
      await dao.updateOneSet(dataPoint._id, { value: 3, date: new Date() })
      dataPoint = await dao.reload(dataPoint);
      expect(dataPoint.date.toISOString()).toEqual(getFullDayDate(date).toISOString());
    });

    it('assure tid is not updatable', async () => {
      const date = new Date('2022-02-20');
      let { dataPoint } = await createEntity(date, CalendarIntervalEnum.Daily);
      await dao.updateOneSet(dataPoint._id, { value: 3, tid: toTimingId(Date()) });
      dataPoint = await dao.reload(dataPoint);
      expect(dataPoint.tid).toEqual(toTimingId(date));
    })

    it('assure meta pid,uid,cid is not updatable', async () => {
      const date = new Date('2022-02-20');
      const { dataPoint } = await createEntity(date, CalendarIntervalEnum.Daily);
      await dao.updateOneSet(dataPoint._id, {
        value: 3,
        'meta.pid': getObjectId('p2'),
        'meta.cid': getObjectId('c2'),
        'meta.uid': getObjectId('u2'),
      });
      const updated = await dao.reload(dataPoint);
      expect(updated.meta.pid).toEqual(dataPoint.meta.pid);
      expect(updated.meta.uid).toEqual(dataPoint.meta.uid);
      expect(updated.meta.interval).toEqual(dataPoint.meta.interval);
    })
  });

  describe('daily interval', () => {
    it('find daily data point', async () => {
      const { pid, uid, date } = await createEntity('2022-02-20', CalendarIntervalEnum.Daily)
      const result = await dao.findByIntervalLevel(pid, uid, new DataPointIntervalFilter(date));
      expect(result.length).toEqual(1);
    });

    it('do not include day after', async () => {
      const { pid, uid, date } = await createEntity('2022-02-20', CalendarIntervalEnum.Daily);
      const result = await dao.findByIntervalLevel(pid, uid, new DataPointIntervalFilter(date.add(1, 'days')));
      expect(result.length).toEqual(0);
    });

    it('do not include day before', async () => {
      const { pid, uid, date } = await createEntity('2022-02-20', CalendarIntervalEnum.Daily);
      const result = await dao.findByIntervalLevel(pid, uid, new DataPointIntervalFilter(date.subtract(1, 'days')));
      expect(result.length).toEqual(0);
    });

    it('do include day if date time level is daily', async () => {
      const { pid, uid, date } = await createEntity('2022-02-20', CalendarIntervalEnum.Daily)
      const result = await dao.findByIntervalLevel(pid, uid, new DataPointIntervalFilter(date, CalendarIntervalEnum.Daily));
      expect(result.length).toEqual(1);
    });
  });

  describe('weekly interval', () => {
    it('find weekly data point', async () => {
      const { pid, uid, date } = await createEntity('2022-02-20', CalendarIntervalEnum.Weekly);
      const result = await dao.findByIntervalLevel(pid, uid, new DataPointIntervalFilter(date));
      expect(result.length).toEqual(1);
    });

    it('do not include date after', async () => {
      const { pid, uid } = await createEntity('2022-02-20', CalendarIntervalEnum.Weekly);
      const result = await dao.findByIntervalLevel(pid, uid, new DataPointIntervalFilter(dateTime('2022-02-13')));
      expect(result.length).toEqual(0);
    });

    it('do not include date before', async () => {
      const { pid, uid } = await createEntity('2022-02-20', CalendarIntervalEnum.Weekly);
      const result = await dao.findByIntervalLevel(pid, uid, new DataPointIntervalFilter(dateTime('2022-02-21')));
      expect(result.length).toEqual(0);
    });

    it('do not include if interval level is daily', async () => {
      const { pid, uid, date } = await createEntity('2022-02-20', CalendarIntervalEnum.Weekly);
      const result = await dao.findByIntervalLevel(pid, uid, new DataPointIntervalFilter(date, CalendarIntervalEnum.Daily));
      expect(result.length).toEqual(0);
    });

    it('do include if interval level is weekly', async () => {
      const { pid, uid, date } = await createEntity('2022-02-20', CalendarIntervalEnum.Weekly);
      const result = await dao.findByIntervalLevel(pid, uid, new DataPointIntervalFilter(date, CalendarIntervalEnum.Weekly));
      expect(result.length).toEqual(1);
    });

    it('do include if interval level is monthly', async () => {
      const { pid, uid, date } = await createEntity('2022-02-20', CalendarIntervalEnum.Weekly);
      const result = await dao.findByIntervalLevel(pid, uid, new DataPointIntervalFilter(date, CalendarIntervalEnum.Monthly));
      expect(result.length).toEqual(1);
    });

    it('do include if interval level is quarterly', async () => {
      const { pid, uid, date } = await createEntity('2022-02-20', CalendarIntervalEnum.Weekly);
      const result = await dao.findByIntervalLevel(pid, uid, new DataPointIntervalFilter(date, CalendarIntervalEnum.Quarterly));
      expect(result.length).toEqual(1);
    });

    it('do include if interval level is yearly', async () => {
      const { pid, uid, date } = await createEntity('2022-02-20', CalendarIntervalEnum.Weekly);
      const result = await dao.findByIntervalLevel(pid, uid, new DataPointIntervalFilter(date, CalendarIntervalEnum.Yearly));
      expect(result.length).toEqual(1);
    });

    it('do include if interval level is yearly', async () => {
      const { pid, uid, date } = await createEntity('2022-02-20', CalendarIntervalEnum.Weekly);
      const result = await dao.findByIntervalLevel(pid, uid, new DataPointIntervalFilter(date, CalendarIntervalEnum.Unscheduled));
      expect(result.length).toEqual(1);
    });
  });

  describe('monthly interval', () => {
    it('find monthly data point by first day of month', async () => {
      const { pid, uid } = await createEntity('2022-02-20', CalendarIntervalEnum.Monthly);
      const result = await dao.findByIntervalLevel(pid, uid, new DataPointIntervalFilter(dateTime('2022-02-01')));
      expect(result.length).toEqual(1);
    });

    it('find monthly data point by last day of month', async () => {
      const { pid, uid } = await createEntity('2022-02-20', CalendarIntervalEnum.Monthly);
      const result = await dao.findByIntervalLevel(pid, uid, new DataPointIntervalFilter(dateTime('2022-02-28')));
      expect(result.length).toEqual(1);
    });

    it('do not include date after', async () => {
      const { pid, uid } = await createEntity('2022-02-20', CalendarIntervalEnum.Monthly);
      const result = await dao.findByIntervalLevel(pid, uid, new DataPointIntervalFilter(dateTime('2022-01-31')));
      expect(result.length).toEqual(0);
    });

    it('do not include date before', async () => {
      const { pid, uid } = await createEntity('2022-02-20', CalendarIntervalEnum.Monthly);
      const result = await dao.findByIntervalLevel(pid, uid, new DataPointIntervalFilter(dateTime('2022-03-01')));
      expect(result.length).toEqual(0);
    });

    it('do not include if interval level is daily', async () => {
      const { pid, uid, date } = await createEntity('2022-02-20', CalendarIntervalEnum.Monthly);
      const result = await dao.findByIntervalLevel(pid, uid, new DataPointIntervalFilter(date, CalendarIntervalEnum.Daily));
      expect(result.length).toEqual(0);
    });

    it('do not include if interval level is weekly', async () => {
      const { pid, uid, date } = await createEntity('2022-02-20', CalendarIntervalEnum.Monthly);
      const result = await dao.findByIntervalLevel(pid, uid, new DataPointIntervalFilter(date, CalendarIntervalEnum.Weekly));
      expect(result.length).toEqual(0);
    });

    it('do include if interval level is monthly', async () => {
      const { pid, uid, date } = await createEntity('2022-02-20', CalendarIntervalEnum.Monthly);
      const result = await dao.findByIntervalLevel(pid, uid, new DataPointIntervalFilter(date, CalendarIntervalEnum.Monthly));
      expect(result.length).toEqual(1);
    });

    it('do include if interval level is quarterly', async () => {
      const { pid, uid, date } = await createEntity('2022-02-20', CalendarIntervalEnum.Monthly);
      const result = await dao.findByIntervalLevel(pid, uid, new DataPointIntervalFilter(date, CalendarIntervalEnum.Quarterly));
      expect(result.length).toEqual(1);
    });

    it('do include if interval level is yearly', async () => {
      const { pid, uid, date } = await createEntity('2022-02-20', CalendarIntervalEnum.Monthly);
      const result = await dao.findByIntervalLevel(pid, uid, new DataPointIntervalFilter(date, CalendarIntervalEnum.Yearly));
      expect(result.length).toEqual(1);
    });

    it('do include if interval level is yearly', async () => {
      const { pid, uid, date } = await createEntity('2022-02-20', CalendarIntervalEnum.Monthly);
      const result = await dao.findByIntervalLevel(pid, uid, new DataPointIntervalFilter(date, CalendarIntervalEnum.Unscheduled));
      expect(result.length).toEqual(1);
    });
  });

  describe('quarterly interval', () => {
    it('find quarterly data point by first day of quarter', async () => {
      const { pid, uid } = await createEntity('2022-02-20', CalendarIntervalEnum.Quarterly);
      const result = await dao.findByIntervalLevel(pid, uid, new DataPointIntervalFilter(dateTime('2022-01-01')));
      expect(result.length).toEqual(1);
    });

    it('find quarterly data point by first day of quarter', async () => {
      const { pid, uid } = await createEntity('2022-02-20', CalendarIntervalEnum.Quarterly);
      const result = await dao.findByIntervalLevel(pid, uid, new DataPointIntervalFilter(dateTime('2022-03-31')));
      expect(result.length).toEqual(1);
    });

    it('do not include date after', async () => {
      const { pid, uid } = await createEntity('2022-04-01', CalendarIntervalEnum.Quarterly);
      const result = await dao.findByIntervalLevel(pid, uid, new DataPointIntervalFilter(dateTime('2022-03-31')));
      expect(result.length).toEqual(0);
    });

    it('do not include date before', async () => {
      const { pid, uid } = await createEntity('2022-02-20', CalendarIntervalEnum.Quarterly);
      const result = await dao.findByIntervalLevel(pid, uid, new DataPointIntervalFilter(dateTime('2022-07-01')));
      expect(result.length).toEqual(0);
    });

    it('do not include if interval level is daily', async () => {
      const { pid, uid, date } = await createEntity('2022-02-20', CalendarIntervalEnum.Quarterly);
      const result = await dao.findByIntervalLevel(pid, uid, new DataPointIntervalFilter(date, CalendarIntervalEnum.Daily));
      expect(result.length).toEqual(0);
    });

    it('do not include if interval level is weekly', async () => {
      const { pid, uid, date } = await createEntity('2022-02-20', CalendarIntervalEnum.Quarterly);
      const result = await dao.findByIntervalLevel(pid, uid, new DataPointIntervalFilter(date, CalendarIntervalEnum.Weekly));
      expect(result.length).toEqual(0);
    });

    it('do not include if interval level is monthly', async () => {
      const { pid, uid, date } = await createEntity('2022-02-20', CalendarIntervalEnum.Quarterly);
      const result = await dao.findByIntervalLevel(pid, uid, new DataPointIntervalFilter(date, CalendarIntervalEnum.Monthly));
      expect(result.length).toEqual(0);
    });

    it('do include if interval level is quarterly', async () => {
      const { pid, uid, date } = await createEntity('2022-02-20', CalendarIntervalEnum.Quarterly);
      const result = await dao.findByIntervalLevel(pid, uid, new DataPointIntervalFilter(date, CalendarIntervalEnum.Quarterly));
      expect(result.length).toEqual(1);
    });

    it('do include if interval level is yearly', async () => {
      const { pid, uid, date } = await createEntity('2022-02-20', CalendarIntervalEnum.Quarterly);
      const result = await dao.findByIntervalLevel(pid, uid, new DataPointIntervalFilter(date, CalendarIntervalEnum.Yearly));
      expect(result.length).toEqual(1);
    });

    it('do include if interval level is yearly', async () => {
      const { pid, uid, date } = await createEntity('2022-02-20', CalendarIntervalEnum.Quarterly);
      const result = await dao.findByIntervalLevel(pid, uid, new DataPointIntervalFilter(date, CalendarIntervalEnum.Unscheduled));
      expect(result.length).toEqual(1);
    });
  });

  describe('yearly interval', () => {
    it('find yearly data point by first day of year', async () => {
      const { pid, uid } = await createEntity('2022-02-20', CalendarIntervalEnum.Yearly);
      const result = await dao.findByIntervalLevel(pid, uid, new DataPointIntervalFilter(dateTime('2022-01-01')));
      expect(result.length).toEqual(1);
    });

    it('find yearly data point by first day of year', async () => {
      const { pid, uid } = await createEntity('2022-02-20', CalendarIntervalEnum.Yearly);
      const result = await dao.findByIntervalLevel(pid, uid, new DataPointIntervalFilter(dateTime('2022-12-31')));
      expect(result.length).toEqual(1);
    });

    it('do not include date after', async () => {
      const { pid, uid } = await createEntity('2022-04-01', CalendarIntervalEnum.Yearly);
      const result = await dao.findByIntervalLevel(pid, uid, new DataPointIntervalFilter(dateTime('2023-01-01')));
      expect(result.length).toEqual(0);
    });

    it('do not include date before', async () => {
      const { pid, uid } = await createEntity('2022-02-20', CalendarIntervalEnum.Yearly);
      const result = await dao.findByIntervalLevel(pid, uid, new DataPointIntervalFilter(dateTime('2021-12-31')));
      expect(result.length).toEqual(0);
    });

    it('do not include if interval level is daily', async () => {
      const { pid, uid, date } = await createEntity('2022-02-20', CalendarIntervalEnum.Yearly);
      const result = await dao.findByIntervalLevel(pid, uid, new DataPointIntervalFilter(date, CalendarIntervalEnum.Daily));
      expect(result.length).toEqual(0);
    });

    it('do not include if interval level is weekly', async () => {
      const { pid, uid, date } = await createEntity('2022-02-20', CalendarIntervalEnum.Yearly);
      const result = await dao.findByIntervalLevel(pid, uid, new DataPointIntervalFilter(date, CalendarIntervalEnum.Weekly));
      expect(result.length).toEqual(0);
    });

    it('do not include if interval level is monthly', async () => {
      const { pid, uid, date } = await createEntity('2022-02-20', CalendarIntervalEnum.Yearly);
      const result = await dao.findByIntervalLevel(pid, uid, new DataPointIntervalFilter(date, CalendarIntervalEnum.Monthly));
      expect(result.length).toEqual(0);
    });

    it('do not include if interval level is quarterly', async () => {
      const { pid, uid, date } = await createEntity('2022-02-20', CalendarIntervalEnum.Yearly);
      const result = await dao.findByIntervalLevel(pid, uid, new DataPointIntervalFilter(date, CalendarIntervalEnum.Quarterly));
      expect(result.length).toEqual(0);
    });

    it('do include if interval level is yearly', async () => {
      const { pid, uid, date } = await createEntity('2022-02-20', CalendarIntervalEnum.Yearly);
      const result = await dao.findByIntervalLevel(pid, uid, new DataPointIntervalFilter(date, CalendarIntervalEnum.Yearly));
      expect(result.length).toEqual(1);
    });

    it('do include if interval level is yearly', async () => {
      const { pid, uid, date } = await createEntity('2022-02-20', CalendarIntervalEnum.Yearly);
      const result = await dao.findByIntervalLevel(pid, uid, new DataPointIntervalFilter(date, CalendarIntervalEnum.Unscheduled));
      expect(result.length).toEqual(1);
    });
  });

  describe('unscheduled interval', () => {
    it('include unscheduled data point for past search date', async () => {
      const { pid, uid } = await createEntity('2022-02-20', CalendarIntervalEnum.Unscheduled);
      const result = await dao.findByIntervalLevel(pid, uid, new DataPointIntervalFilter(dateTime('1998-01-01')));
      expect(result.length).toEqual(1);
    });

    it('include unscheduled data point for future search date', async () => {
      const { pid, uid } = await createEntity('2022-02-20', CalendarIntervalEnum.Unscheduled);
      const result = await dao.findByIntervalLevel(pid, uid, new DataPointIntervalFilter(dateTime().add(5, 'years')));
      expect(result.length).toEqual(1);
    });

    it('do not include if interval level is daily', async () => {
      const { pid, uid, date } = await createEntity('2022-02-20', CalendarIntervalEnum.Unscheduled);
      const result = await dao.findByIntervalLevel(pid, uid, new DataPointIntervalFilter(date, CalendarIntervalEnum.Daily));
      expect(result.length).toEqual(0);
    });

    it('do not include if interval level is weekly', async () => {
      const { pid, uid, date } = await createEntity('2022-02-20', CalendarIntervalEnum.Unscheduled);
      const result = await dao.findByIntervalLevel(pid, uid, new DataPointIntervalFilter(date, CalendarIntervalEnum.Weekly));
      expect(result.length).toEqual(0);
    });

    it('do not include if interval level is monthly', async () => {
      const { pid, uid, date } = await createEntity('2022-02-20', CalendarIntervalEnum.Unscheduled);
      const result = await dao.findByIntervalLevel(pid, uid, new DataPointIntervalFilter(date, CalendarIntervalEnum.Monthly));
      expect(result.length).toEqual(0);
    });

    it('do not include if interval level is quarterly', async () => {
      const { pid, uid, date } = await createEntity('2022-02-20', CalendarIntervalEnum.Unscheduled);
      const result = await dao.findByIntervalLevel(pid, uid, new DataPointIntervalFilter(date, CalendarIntervalEnum.Quarterly));
      expect(result.length).toEqual(0);
    });

    it('do not include if interval level is yearly', async () => {
      const { pid, uid, date } = await createEntity('2022-02-20', CalendarIntervalEnum.Unscheduled);
      const result = await dao.findByIntervalLevel(pid, uid, new DataPointIntervalFilter(date, CalendarIntervalEnum.Yearly));
      expect(result.length).toEqual(0);
    });

    it('do include if interval level is yearly', async () => {
      const { pid, uid, date } = await createEntity('2022-02-20', CalendarIntervalEnum.Unscheduled);
      const result = await dao.findByIntervalLevel(pid, uid, new DataPointIntervalFilter(date, CalendarIntervalEnum.Unscheduled));
      expect(result.length).toEqual(1);
    });
  });

  describe('mixed intervals', () => {
    it('find mixed entries', async () => {
      const entries = await createEntities([
        { date: '2022-02-20', interval: CalendarIntervalEnum.Daily },
        { date: '2022-02-14', interval: CalendarIntervalEnum.Weekly },
        { date: '2022-02-28', interval: CalendarIntervalEnum.Monthly },
        { date: '2022-01-20', interval: CalendarIntervalEnum.Quarterly },
        { date: '2022-12-31', interval: CalendarIntervalEnum.Yearly },
      ]);

      const { pid, uid } = entries[0];
      const result = await dao.findByIntervalLevel(pid, uid, new DataPointIntervalFilter(dateTime('2022-02-20')));
      expect(result.length).toEqual(5);
    });
  });

  // TODO: Add log (merge times, validate value)
  // TODO: Test change content interval (align intervals of data point buckets)
  // TODO: Test different locales (weekofyear translation)
  // TODO: Test cid access
});

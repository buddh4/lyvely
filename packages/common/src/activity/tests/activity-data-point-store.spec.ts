import {
  CalendarIntervalEnum,
  HabitModel,
  NumberDataPointModel,
  TaskModel,
  toTimingId
} from '../../index';
import { ActivityDataPointStore } from '../common';

describe('ActivityDataPointStore', () => {

  let store: ActivityDataPointStore;
  let model: HabitModel;
  let logModel: NumberDataPointModel;
  let timingId: string;

  beforeEach(() => {
    store = new ActivityDataPointStore();
    model = new HabitModel({ id: 'test', title: 'test task' });
    timingId = toTimingId(new Date(), CalendarIntervalEnum.Daily);
    logModel = new NumberDataPointModel({ id: 'test-log', cid: 'test', value: 2, tid: timingId });
  });

  describe('addModel', function () {
    it('add a model', async () => {
      store.addModel(model);
      const search = store.getModel('test');
      expect(search).toBeTruthy();
      expect(search.id).toEqual('test');
    });
  });

  describe('getModel', function () {
    it('get a model by id', async () => {
      store.addModel(model);

      const search = store.getModel('test');

      expect(search).toBeTruthy();
      expect(search.id).toEqual('test');
    });

    it('get a model by instance', async () => {
      store.addModel(model);

      const search = store.getModel(model);

      expect(search).toBeTruthy();
      expect(search.id).toEqual('test');
    });
  });

  describe('hasModel', function () {
    it('hasModel by id', async () => {
      store.addModel(model);
      expect(store.hasModel('test')).toEqual(true);
    });

    it('hasModel by model', async () => {
      store.addModel(model);
      expect(store.hasModel(model)).toEqual(true);
    });
  });

  describe('addLog', function () {
    it('get a task by model id', async () => {
      store.addDataPoint(logModel);
      expect(store.hasDataPoint('test', timingId)).toEqual(true);
    });
  });

  describe('getLog', function () {
    it('get non existing log of non existing model', async () => {
      expect(store.getDataPoint(model, timingId)).not.toBeDefined();
    });

    it('get non existing log of existing model', async () => {
      store.addModel(model);
      expect(store.getDataPoint(model, timingId)).not.toBeDefined();
    });

    it('get existing log without create', async () => {
      store.addModel(model);
      store.addDataPoint(logModel);
      expect(store.getDataPoint(model, timingId)).toBeDefined();
    });

    it('get non existing log with create', async () => {
      store.addModel(model);
      const search = store.getDataPoint(model, timingId, true);
      expect(search).toBeDefined();
      expect(search.cid).toEqual(model.id);
      expect(search.tid).toEqual(timingId);
      expect(search.value).toEqual(0);
    });
  });

  describe('sort', function () {
    it('sort done tasks after', async () => {
      store.addModel(new TaskModel({ id: 't3', sortOrder: 3 }));
      store.addModel(new TaskModel({ id: 't2', sortOrder: 2 }));
      store.addModel(new TaskModel({ id: 't1', sortOrder: 1, done: timingId }));
      store.addModel(new TaskModel({ id: 't0', sortOrder: 0, done: timingId }));
      const sorted = store.sort(Array.from(store.models.values()));
      expect(sorted[0].id).toEqual('t2');
      expect(sorted[1].id).toEqual('t3');
      expect(sorted[2].id).toEqual('t0');
      expect(sorted[3].id).toEqual('t1');
    });
  });

  describe('getHabitsByCalendarPlan', function () {
    it('filter by interval', async () => {
      store.addModel(new HabitModel({ id: 't3', dataPointConfig: <any> { interval: CalendarIntervalEnum.Daily }, sortOrder: 3 }));
      store.addModel(new HabitModel({ id: 't2', dataPointConfig: <any> { interval: CalendarIntervalEnum.Daily }, sortOrder: 2 }));
      store.addModel(new HabitModel({ id: 't1', dataPointConfig: <any> { interval: CalendarIntervalEnum.Weekly } }));
      const result = store.getHabitsByCalendarInterval(CalendarIntervalEnum.Daily);
      expect(result.length).toEqual(2);
      expect(result[0].id).toEqual('t2');
      expect(result[1].id).toEqual('t3');
    });
  });

  describe('getTasksByCalendarPlan', function () {
    it('only include done task which where done at the searched timingId', async () => {
      store.addModel(new TaskModel({ id: 't4', dataPointConfig: <any> { interval: CalendarIntervalEnum.Daily }, sortOrder: 3 }));
      store.addModel(new TaskModel({ id: 't3', dataPointConfig: <any> { interval: CalendarIntervalEnum.Daily }, sortOrder: 2 }));
      store.addModel(new TaskModel({ id: 't2', dataPointConfig: <any> { interval: CalendarIntervalEnum.Daily }, sortOrder: 0, done: timingId }));
      store.addModel(new TaskModel({ id: 't1', dataPointConfig: <any> { interval: CalendarIntervalEnum.Daily }, done: 'anotherday...' }));
      store.addModel(new TaskModel({ id: 't0', dataPointConfig: <any> { interval: CalendarIntervalEnum.Weekly } }));
      const result = store.getTasksByCalendarInterval(CalendarIntervalEnum.Daily, timingId);
      expect(result.length).toEqual(3);
      expect(result[0].id).toEqual('t3');
      expect(result[1].id).toEqual('t4');
      expect(result[2].id).toEqual('t2');
    });
  });
});

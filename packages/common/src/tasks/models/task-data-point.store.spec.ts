import { TaskModel } from './task.model';
import { CalendarIntervalEnum, toTimingId } from '@/calendar';
import { TaskDataPointStore } from './task-data-point.store';
import { ContentMetadataModel } from '@/content';

describe('ActivityDataPointStore', () => {
  let store: TaskDataPointStore;
  let timingId: string;

  beforeEach(() => {
    store = new TaskDataPointStore();
    timingId = toTimingId(new Date(), CalendarIntervalEnum.Daily);
  });

  describe('sort', function () {
    it('sort done tasks after', async () => {
      store.setModel(new TaskModel({ id: 't3', meta: new ContentMetadataModel({ sortOrder: 3 }) }));
      store.setModel(new TaskModel({ id: 't2', meta: new ContentMetadataModel({ sortOrder: 2 }) }));
      store.setModel(
        new TaskModel({
          id: 't1',
          meta: new ContentMetadataModel({ sortOrder: 1 }),
          done: timingId,
        }),
      );
      store.setModel(
        new TaskModel({
          id: 't0',
          meta: new ContentMetadataModel({ sortOrder: 0 }),
          done: timingId,
        }),
      );
      const sorted = store.sort(store.getModels());
      expect(sorted[0].id).toEqual('t2');
      expect(sorted[1].id).toEqual('t3');
      expect(sorted[2].id).toEqual('t0');
      expect(sorted[3].id).toEqual('t1');
    });
  });

  describe('getTasksByCalendarPlan', function () {
    it('only include done task which where done at the searched timingId', async () => {
      store.setModel(
        new TaskModel({
          id: 't4',
          config: { timeSeries: <any>{ interval: CalendarIntervalEnum.Daily }, score: 0 },
          meta: new ContentMetadataModel({ sortOrder: 3 }),
        }),
      );
      store.setModel(
        new TaskModel({
          id: 't3',
          config: { timeSeries: <any>{ interval: CalendarIntervalEnum.Daily }, score: 0 },
          meta: new ContentMetadataModel({ sortOrder: 2 }),
        }),
      );
      store.setModel(
        new TaskModel({
          id: 't2',
          config: { timeSeries: <any>{ interval: CalendarIntervalEnum.Daily }, score: 0 },
          meta: new ContentMetadataModel({ sortOrder: 0 }),
          done: timingId,
        }),
      );
      store.setModel(
        new TaskModel({
          id: 't1',
          config: { timeSeries: <any>{ interval: CalendarIntervalEnum.Daily }, score: 0 },
          done: 'anotherday...',
        }),
      );
      store.setModel(
        new TaskModel({
          id: 't0',
          config: { timeSeries: <any>{ interval: CalendarIntervalEnum.Weekly }, score: 0 },
        }),
      );

      const result = store.getModelsByIntervalFilter(
        CalendarIntervalEnum.Daily,
        undefined,
        timingId,
      );

      expect(result.length).toEqual(3);
      expect(result[0].id).toEqual('t3');
      expect(result[1].id).toEqual('t4');
      expect(result[2].id).toEqual('t2');
    });
  });
});

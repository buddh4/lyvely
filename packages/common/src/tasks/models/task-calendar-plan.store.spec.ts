import { TaskModel } from './task.model';
import { CalendarInterval } from '@/calendar';
import { toTimingId } from '@/calendar-plan';
import { TaskCalendarPlanStore } from './task-calendar-plan.store';
import { ContentMetadataModel } from '@/content';
import { UserAssignmentStrategy } from '@/collab';

describe('ActivityDataPointStore', () => {
  let store: TaskCalendarPlanStore;
  let timingId: string;

  beforeEach(() => {
    store = new TaskCalendarPlanStore();
    timingId = toTimingId(new Date(), CalendarInterval.Daily);
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
      const config = {
        interval: CalendarInterval.Daily,
        score: 0,
        userStrategy: UserAssignmentStrategy.Shared,
      };
      store.setModel(
        new TaskModel({
          id: 't4',
          config,
          meta: new ContentMetadataModel({ sortOrder: 3 }),
        }),
      );
      store.setModel(
        new TaskModel({
          id: 't3',
          config,
          meta: new ContentMetadataModel({ sortOrder: 2 }),
        }),
      );
      store.setModel(
        new TaskModel({
          id: 't2',
          config,
          meta: new ContentMetadataModel({ sortOrder: 0 }),
          done: timingId,
        }),
      );
      store.setModel(
        new TaskModel({
          id: 't1',
          config,
          done: 'anotherday...',
        }),
      );
      store.setModel(
        new TaskModel({
          id: 't0',
          config,
        }),
      );

      const result = store.getModelsByIntervalFilter(CalendarInterval.Daily, undefined, timingId);

      expect(result.length).toEqual(3);
      expect(result[0].id).toEqual('t3');
      expect(result[1].id).toEqual('t4');
      expect(result[2].id).toEqual('t2');
    });
  });
});

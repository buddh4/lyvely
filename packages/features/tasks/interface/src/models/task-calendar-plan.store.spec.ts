import { SingleUserTaskStateModel, TaskModel } from './task.model';
import { CalendarInterval, toTimingId } from '@lyvely/dates';
import { TaskCalendarPlanStore } from './task-calendar-plan.store';
import { ContentMetadataModel, UserAssignmentStrategy } from '@lyvely/interface';

describe('ActivityDataPointStore', () => {
  let store: TaskCalendarPlanStore;
  let timingId: string;

  beforeEach(() => {
    store = new TaskCalendarPlanStore();
    timingId = toTimingId(new Date(), CalendarInterval.Daily);
  });

  describe('sort', function () {
    it('sort done tasks after', async () => {
      store.setModel(
        new TaskModel({ id: 't3', meta: new ContentMetadataModel({ sortOrder: 3 } as any) }),
      );
      store.setModel(
        new TaskModel({ id: 't2', meta: new ContentMetadataModel({ sortOrder: 2 } as any) }),
      );
      store.setModel(
        new TaskModel({
          id: 't1',
          meta: new ContentMetadataModel({ sortOrder: 1 } as any),
          state: new SingleUserTaskStateModel({ done: timingId }),
        }),
      );
      store.setModel(
        new TaskModel({
          id: 't0',
          meta: new ContentMetadataModel({ sortOrder: 0 } as any),
          state: new SingleUserTaskStateModel({ done: timingId }),
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
          id: 't3',
          config,
        }),
      );
      store.setModel(
        new TaskModel({
          id: 't2',
          config,
          state: new SingleUserTaskStateModel({ done: timingId }),
        }),
      );
      store.setModel(
        new TaskModel({
          id: 't1',
          config,
          state: new SingleUserTaskStateModel({ done: 'anotherday...' }),
        }),
      );

      const result = store.getModelsByIntervalFilter(CalendarInterval.Daily, undefined, timingId);

      expect(result.length).toEqual(2);
      expect(result[0].id).toEqual('t3');
      expect(result[1].id).toEqual('t2');
    });
  });
});

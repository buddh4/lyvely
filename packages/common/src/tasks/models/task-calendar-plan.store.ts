import { CalendarInterval } from '@/calendar';
import { TaskFilter } from './task-filter.model';
import { TaskModel } from './task.model';
import { sortTasks } from '@/tasks/models/task.sort';
import { CalendarPlanStore } from '@/calendar-plan/models/calendar-plan.store';

export class TaskCalendarPlanStore extends CalendarPlanStore<TaskModel> {
  sort(models: TaskModel[]): TaskModel[] {
    return sortTasks(models);
  }

  getModelsByIntervalFilter(
    interval: CalendarInterval,
    filter?: TaskFilter,
    tid?: string,
  ): TaskModel[] {
    return <TaskModel[]>this.filterModels((entry) => {
      return (
        entry.interval === interval &&
        (!entry.done || entry.done === tid) &&
        (!filter || filter.check(entry))
      );
    });
  }
}

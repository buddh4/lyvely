import { CalendarInterval } from '@lyvely/dates';
import { TaskFilter } from './task-filter.model';
import { TaskModel } from './task.model';
import { sortTasks } from './task.sort';
import { CalendarPlanStore } from '@lyvely/calendar-plan-interface';

export class TaskCalendarPlanStore extends CalendarPlanStore<TaskModel> {
  override sort(models: TaskModel[]): TaskModel[] {
    return sortTasks(models);
  }

  override getModelsByIntervalFilter(
    interval: CalendarInterval,
    filter?: TaskFilter,
    tid?: string
  ): TaskModel[] {
    return <TaskModel[]>this.filterModels((entry) => {
      return (
        entry.interval === interval &&
        (!entry.state.done || entry.state.done === tid) &&
        (!filter || filter.check(entry))
      );
    });
  }
}

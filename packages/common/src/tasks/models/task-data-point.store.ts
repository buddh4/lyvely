import { TimeSeriesDataPointStore } from '@/time-series';
import { CalendarIntervalEnum } from '@/calendar';
import { TaskFilter } from './task-filter.model';
import { TaskModel } from './task.model';
import { sortTasks } from '@/tasks/models/task.sort';

export class TaskDataPointStore extends TimeSeriesDataPointStore<TaskModel> {
  sort(models: TaskModel[]): TaskModel[] {
    return sortTasks(models);
  }

  getModelsByIntervalFilter(
    interval: CalendarIntervalEnum,
    filter?: TaskFilter,
    tid?: string,
  ): TaskModel[] {
    return <TaskModel[]>this.filterModels((entry) => {
      return (
        entry.timeSeriesConfig.interval === interval &&
        (!entry.done || entry.done === tid) &&
        (!filter || filter.check(entry))
      );
    });
  }
}

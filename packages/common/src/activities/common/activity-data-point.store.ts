import { CalendarIntervalEnum } from '@/calendar';
import { ActivityType, ActivityFilter, ActivityModel } from '../models';
import { HabitModel } from '../habits';
import { isTask, TaskModel } from '../tasks';
import { NumberDataPointModel, TimeSeriesDataPointStore } from '@/time-series';
import { sortActivities } from './activities.sort';

export class ActivityDataPointStore extends TimeSeriesDataPointStore<ActivityModel, NumberDataPointModel> {
  sort(models: ActivityModel[]) {
    return sortActivities(models);
  }

  createDataPoint(model: ActivityModel, timingId: string): NumberDataPointModel {
    return new NumberDataPointModel({ cid: model.id, interval: model.timeSeriesConfig.interval, tid: timingId });
  }

  getHabitsByCalendarInterval(interval: CalendarIntervalEnum, filter?: ActivityFilter): HabitModel[] {
    return this.filterModels((entry) => {
      return (
        entry.type === ActivityType.Habit &&
        entry.timeSeriesConfig.interval === interval &&
        (!filter || filter.check(entry))
      );
    });
  }

  getTasksByCalendarInterval(interval: CalendarIntervalEnum, timingId: string, filter?: ActivityFilter): TaskModel[] {
    return <TaskModel[]>this.filterModels((entry) => {
      return (
        isTask(entry) &&
        entry.timeSeriesConfig.interval === interval &&
        (!entry.done || entry.done === timingId) &&
        (!filter || filter.check(entry))
      );
    });
  }
}

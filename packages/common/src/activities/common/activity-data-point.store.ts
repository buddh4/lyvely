import { CalendarIntervalEnum } from '@/calendar';
import { ActivityType, ActivityFilter, ActivityModel } from '../models';
import { HabitModel } from '../habit';
import { isTask, TaskModel } from '../task';
import { NumberDataPointModel, TimeSeriesDataPointStore } from '@/time-series';
import { sortActivities } from './activities.sort';

export class ActivityDataPointStore extends TimeSeriesDataPointStore<ActivityModel, NumberDataPointModel> {
  sort(models: ActivityModel[]) {
    return sortActivities(models);
  }

  createDataPoint(model: ActivityModel, timingId: string): NumberDataPointModel {
    return new NumberDataPointModel({ cid: model.id, interval: model.dataPointConfig.interval, tid: timingId });
  }

  getHabitsByCalendarInterval(interval: CalendarIntervalEnum, filter?: ActivityFilter): HabitModel[] {
    return this.filterModels((entry) => {
      return (
        entry.type === ActivityType.Habit &&
        entry.dataPointConfig.interval === interval &&
        (!filter || filter.check(entry))
      );
    });
  }

  getTasksByCalendarInterval(interval: CalendarIntervalEnum, timingId: string, filter?: ActivityFilter): TaskModel[] {
    return <TaskModel[]>this.filterModels((entry) => {
      return (
        isTask(entry) &&
        entry.dataPointConfig.interval === interval &&
        (!entry.done || entry.done === timingId) &&
        (!filter || filter.check(entry))
      );
    });
  }
}

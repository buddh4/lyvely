import { CalendarIntervalEnum } from '@/calendar';
import { ActivityFilter, ActivityModel, ActivityType } from '../models';
import { isTask, TaskModel } from '../tasks';
import { NumberDataPointModel, TimeSeriesDataPointStore } from '@/time-series';
import { sortActivities } from './activities.sort';

export class ActivityDataPointStore extends TimeSeriesDataPointStore<
  ActivityModel,
  NumberDataPointModel
> {
  sort(models: ActivityModel[]) {
    return sortActivities(models);
  }

  createDataPoint(model: ActivityModel, timingId: string): NumberDataPointModel {
    return new NumberDataPointModel({
      cid: model.id,
      interval: model.timeSeriesConfig.interval,
      tid: timingId,
    });
  }

  getModelsByIntervalFilter(
    interval: CalendarIntervalEnum,
    filter?: ActivityFilter,
    tid?: string,
  ): ActivityModel[] {
    if (filter.option('type') === ActivityType.Task && tid) {
      return this.getTasksByCalendarInterval(interval, filter, tid);
    }

    return super.getModelsByIntervalFilter(interval, filter, tid);
  }

  getTasksByCalendarInterval(
    interval: CalendarIntervalEnum,
    filter?: ActivityFilter,
    tid?: string,
  ): TaskModel[] {
    return <TaskModel[]>this.filterModels((entry) => {
      return (
        isTask(entry) &&
        entry.timeSeriesConfig.interval === interval &&
        (!entry.done || entry.done === tid) &&
        (!filter || filter.check(entry))
      );
    });
  }
}

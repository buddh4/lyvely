import { CalendarIntervalEnum } from '../../calendar';
import { ActivityType, IActivity } from '../interfaces';
import { IHabit } from '../habit';
import { isTask, ITask } from '../task';
import { ActivityFilter } from '../models';
import { ITimeSeriesNumberDataPoint, NumberDataPointDto, TimeSeriesDataPointStore } from '../../time-series';
import { sortActivities } from './activities.sort';

export class ActivityDataPointStore extends TimeSeriesDataPointStore<IActivity, ITimeSeriesNumberDataPoint> {
    sort(models: IActivity[]) {
        return sortActivities(models);
    }

    createDataPoint(model: IActivity, timingId: string): ITimeSeriesNumberDataPoint {
      return new NumberDataPointDto({ cid: model.id, interval: model.dataPointConfig.interval, tid: timingId });
    }

    getHabitsByCalendarInterval(interval: CalendarIntervalEnum, filter?: ActivityFilter): IHabit[] {
        return this.filterModels(entry => {
          return entry.type === ActivityType.Habit
          && entry.dataPointConfig.interval === interval
          && (!filter || filter.run(entry));
        })
    }

    getTasksByCalendarInterval(interval: CalendarIntervalEnum, timingId: string, filter?: ActivityFilter): ITask[] {
        return <ITask[]> this.filterModels(entry => {
            return isTask(entry)
              && entry.dataPointConfig.interval === interval
              && (!entry.done || entry.done === timingId)
              && (!filter || filter.run(entry));
        });
    }
}


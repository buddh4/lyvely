import { CalendarIntervalEnum } from '../../calendar';
import { ActivityType, IActivity, IActivityDataPoint } from '../interfaces';
import { IHabit } from '../habit';
import { ITask } from '../task';
import { ActivityDataPointDto, ActivityFilter } from '../models';
import { TimeSeriesDataPointStore } from '../../time-series';
import { sortActivities } from './activities.sort';

export class ActivityDataPointStore extends TimeSeriesDataPointStore<IActivity, IActivityDataPoint> {
    sort(models: IActivity[]) {
        return sortActivities(models);
    }

    createLog(model: IActivity, timingId: string): IActivityDataPoint {
        return ActivityDataPointDto.createForActivity(model, timingId);
    }

    getHabitsByCalendarPlan(interval: CalendarIntervalEnum, filter?: ActivityFilter): IHabit[] {
        return this.filterModels(entry =>
          entry.type === ActivityType.Habit
          && entry.interval === interval
          && (!filter || filter.run(entry)));
    }

    getTasksByCalendarPlan(interval: CalendarIntervalEnum, timingId: string, filter?: ActivityFilter): ITask[] {
        return <ITask[]> this.filterModels(entry => {
            return entry.type === ActivityType.Task
              && entry.interval === interval
              && (!entry.done || entry.done === timingId)
              && (!filter || filter.run(entry));
        });
    }
}


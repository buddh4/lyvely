import { CalendarIntervalEnum } from '@/calendar';
import {
  DataPointInputType,
  DataPointValueType,
  INumberDataPointConfig,
  TimeSeriesContentModel,
} from '@/time-series';
import { Expose } from 'class-transformer';
import { UserAssignmentStrategy } from '@/collab';

export enum ActivityType {
  Task = 'Task',
  Habit = 'Habit',
}

export interface IActivityConfig {
  score: number;
  timeSeries: INumberDataPointConfig;
}

@Expose()
export class ActivityModel<
  T extends ActivityModel<any> = ActivityModel<any>,
> extends TimeSeriesContentModel<T, IActivityConfig> {
  getEditDto() {
    return undefined;
  }

  getDefaultConfig(): IActivityConfig {
    return {
      score: 0,
      timeSeries: {
        interval: CalendarIntervalEnum.Daily,
        inputType: DataPointInputType.Checkbox,
        valueType: DataPointValueType.Number,
        userStrategy: UserAssignmentStrategy.Shared,
        history: [],
      },
    };
  }
}

export function isActivity(obj: any): obj is ActivityModel {
  return obj?.type && ([ActivityType.Task, ActivityType.Habit] as string[]).includes(obj.type);
}

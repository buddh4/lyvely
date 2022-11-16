import { IsEnum, IsNumber } from 'class-validator';
import { CalendarIntervalEnum } from '@/calendar';
import { INumberDataPointConfig, DataPointInputType, DataPointValueType, TimeSeriesContentModel } from '@/time-series';
import { Expose } from 'class-transformer';

export enum ActivityType {
  Task = 'Task',
  Habit = 'Habit',
}

@Expose()
export abstract class ActivityModel<
  T extends ActivityModel<any> = ActivityModel<any>,
> extends TimeSeriesContentModel<INumberDataPointConfig> {
  @IsEnum(ActivityType)
  type: string;

  @IsNumber()
  score: number;

  constructor(obj?: Partial<T> & { _id?: any }) {
    super(obj);
    this.dataPointConfig = this.dataPointConfig || {
      interval: CalendarIntervalEnum.Daily,
      inputType: DataPointInputType.Checkbox,
      valueType: DataPointValueType.Number,
      history: [],
    };
  }
}

export function isActivity(obj: any): obj is ActivityModel {
  return obj?.type && ([ActivityType.Task, ActivityType.Habit] as string[]).includes(obj.type);
}

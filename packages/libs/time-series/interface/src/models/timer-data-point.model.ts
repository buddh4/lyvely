import { Expose, Type } from 'class-transformer';
import { DataPointModel } from './data-point.model';
import {
  DataPointValueType,
  IDataPointConfig,
  ITimerDataPointConfig,
  NumericDataPointInterface,
} from '../interfaces';
import { BaseModel, PropertyType } from '@lyvely/common';
import { TimerModel } from '@lyvely/timers-interface';
import { IsNumber, Min, ValidateNested } from 'class-validator';

export class TimerDataPointValueModel<TID = string> extends BaseModel<
  TimerDataPointValueModel<TID>
> {
  @Expose()
  @PropertyType(TimerModel)
  @ValidateNested()
  timer: TimerModel<TID>;

  @Expose()
  @IsNumber()
  @Min(0)
  @PropertyType(Number, { default: 0 })
  ms: number;
}

export class TimerDataPointModel<TID = string>
  extends DataPointModel<TID, TimerDataPointModel<TID>>
  implements NumericDataPointInterface
{
  @Expose()
  @PropertyType(TimerDataPointValueModel)
  value: TimerDataPointValueModel<TID>;

  get numericValue() {
    return this.value.ms;
  }

  @Expose()
  valueType = DataPointValueType.Timer;
}

export function isTimerDataPointConfig(config: IDataPointConfig): config is ITimerDataPointConfig {
  return config.valueType === DataPointValueType.Timer;
}

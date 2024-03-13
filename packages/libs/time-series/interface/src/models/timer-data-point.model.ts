import { Expose } from 'class-transformer';
import { DataPointModel } from './data-point.model';
import {
  DataPointValueType,
  IDataPointConfig,
  ITimerDataPointConfig,
  NumericDataPointInterface,
} from '../interfaces';
import { BaseModel, type PropertiesOf, PropertyType } from '@lyvely/common';
import { TimerModel } from '@lyvely/timers-interface';
import { IsNumber, Min, ValidateNested } from 'class-validator';

export class TimerDataPointValueModel<TID = string> {
  @Expose()
  @PropertyType(TimerModel)
  @ValidateNested()
  timer: TimerModel<TID>;

  @Expose()
  @IsNumber()
  @Min(0)
  @PropertyType(Number, { default: 0 })
  ms: number;

  constructor(data: PropertiesOf<TimerDataPointValueModel<any>>) {
    BaseModel.init(this, data);
  }
}

export class TimerDataPointModel<TID = string>
  extends DataPointModel<TID>
  implements NumericDataPointInterface
{
  @Expose()
  @PropertyType(TimerDataPointValueModel)
  override value: TimerDataPointValueModel<TID>;

  @Expose()
  override valueType = DataPointValueType.Timer;

  get numericValue() {
    return this.value.ms;
  }
}

export function isTimerDataPointConfig(config: IDataPointConfig): config is ITimerDataPointConfig {
  return config.valueType === DataPointValueType.Timer;
}

import { Expose, Type } from 'class-transformer';
import { DataPointModel } from './data-point.model';
import {
  DataPointValueType,
  IDataPointConfig,
  ITimerDataPointConfig,
  NumericDataPointInterface,
} from '../interfaces';
import { BaseModel, PropertyType } from '@lyvely/models';
import { TimerModel } from '@lyvely/dates';
import { IsNumber, Min, ValidateNested } from 'class-validator';

export class TimerDataPointValueModel extends BaseModel<TimerDataPointValueModel> {
  @Expose()
  @Type(() => TimerModel)
  @PropertyType(TimerModel)
  @ValidateNested()
  timer: TimerModel;

  @Expose()
  @IsNumber()
  @Min(0)
  @PropertyType(Number, { default: 0 })
  ms: number;
}

export class TimerDataPointModel
  extends DataPointModel<TimerDataPointModel>
  implements NumericDataPointInterface
{
  @Expose()
  @Type(() => TimerDataPointValueModel)
  @PropertyType(TimerDataPointValueModel)
  value: TimerDataPointValueModel;

  get numericValue() {
    return this.value.ms;
  }

  @Expose()
  valueType = DataPointValueType.Timer;
}

export function isTimerDataPointConfig(config: IDataPointConfig): config is ITimerDataPointConfig {
  return config.valueType === DataPointValueType.Timer;
}

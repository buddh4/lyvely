import { Expose, Type as TransformType } from 'class-transformer';
import { TimerModel } from '@/calendar';
import { PropertyType } from '@/models';
import { DataPointModel } from './data-point.model';
import {
  DataPointValueType,
  INumberDataPointConfig,
  IDataPointConfig,
  INumericDataPoint,
} from '../interfaces';

export class NumberDataPointModel
  extends DataPointModel<NumberDataPointModel>
  implements INumericDataPoint
{
  @Expose()
  value: number;

  get numericValue() {
    return this.value;
  }

  @Expose()
  @TransformType(() => TimerModel)
  @PropertyType(TimerModel)
  timer?: TimerModel;

  @Expose()
  valueType = DataPointValueType.Number;

  afterInit() {
    this.value = this.value ?? 0;
  }
}

export function isNumberDataPointConfig(
  config: IDataPointConfig,
): config is INumberDataPointConfig {
  return config.valueType === DataPointValueType.Number;
}

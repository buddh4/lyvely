import { Expose } from 'class-transformer';
import { DataPointModel } from './data-point.model';
import {
  DataPointValueType,
  INumberDataPointConfig,
  IDataPointConfig,
  NumericDataPointInterface,
} from '../interfaces';

export class NumberDataPointModel
  extends DataPointModel<NumberDataPointModel>
  implements NumericDataPointInterface
{
  @Expose()
  value: number;

  get numericValue() {
    return this.value;
  }

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

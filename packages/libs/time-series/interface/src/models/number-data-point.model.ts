import { Expose } from 'class-transformer';
import { DataPointModel } from './data-point.model';
import {
  DataPointValueType,
  INumberDataPointConfig,
  IDataPointConfig,
  NumericDataPointInterface,
} from '../interfaces';

export class NumberDataPointModel<TID = string>
  extends DataPointModel<TID>
  implements NumericDataPointInterface
{
  @Expose()
  override value = 0;

  @Expose()
  override valueType = DataPointValueType.Number;

  get numericValue() {
    return this.value;
  }
}

export function isNumberDataPointConfig(
  config: IDataPointConfig,
): config is INumberDataPointConfig {
  return config.valueType === DataPointValueType.Number;
}

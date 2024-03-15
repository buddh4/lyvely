import { Expose } from 'class-transformer';
import { DataPointModel } from './data-point.model';
import {
  DataPointValueType,
  INumberDataPointConfig,
  IDataPointConfig,
  NumericDataPointInterface,
} from '../interfaces';
import { type BaseModelData, BaseModel, PropertyType } from '@lyvely/common';

export class NumberDataPointModel<TID = string>
  extends DataPointModel<TID>
  implements NumericDataPointInterface
{
  @Expose()
  @PropertyType(Number, { default: 0 })
  override value: number;

  @Expose()
  override valueType = DataPointValueType.Number;

  constructor(data: BaseModelData<DataPointModel<any>>) {
    super(false);
    BaseModel.init(this, data);
  }

  get numericValue() {
    return this.value;
  }
}

export function isNumberDataPointConfig(
  config: IDataPointConfig,
): config is INumberDataPointConfig {
  return config.valueType === DataPointValueType.Number;
}

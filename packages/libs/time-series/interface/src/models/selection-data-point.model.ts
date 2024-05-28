import { Expose } from 'class-transformer';
import { DataPointModel } from './data-point.model';
import { DataPointValueType, IDataPointConfig, ISelectionDataPointConfig } from '../interfaces';
import type { ISelectionDataPointValue } from '../interfaces';
import { type BaseModelData, BaseModel, type PropertiesOf, PropertyType } from '@lyvely/common';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';

@Expose()
export class SelectionDataPointValueModel implements ISelectionDataPointValue {
  @IsString({ each: true })
  @MaxLength(250, { each: true })
  @PropertyType([String])
  selection: Array<string>;

  @IsString()
  @MaxLength(250)
  @IsOptional()
  otherValue?: string;

  constructor(data: PropertiesOf<SelectionDataPointValueModel>) {
    BaseModel.init(this, data);
  }
}

@Expose()
export class SelectionDataPointModel<TID = string> extends DataPointModel<TID> {
  @PropertyType(SelectionDataPointValueModel)
  override value: ISelectionDataPointValue;

  @IsEnum([DataPointValueType.Selection])
  override valueType = DataPointValueType.Selection;

  constructor(data: BaseModelData<SelectionDataPointModel<any>>) {
    super(false);
    BaseModel.init(this, data);
  }
}

export function isSelectionDataPointConfig(
  config: IDataPointConfig
): config is ISelectionDataPointConfig {
  return config.valueType === DataPointValueType.Selection;
}

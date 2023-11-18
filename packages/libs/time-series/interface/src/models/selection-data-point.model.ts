import { Expose, Type } from 'class-transformer';
import { DataPointModel } from './data-point.model';
import { DataPointValueType, IDataPointConfig, ISelectionDataPointConfig } from '../interfaces';
import type { ISelectionDataPointValue } from '../interfaces';
import { BaseModel, PropertyType } from '@lyvely/common';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';

@Expose()
export class SelectionDataPointValueModel
  extends BaseModel<SelectionDataPointValueModel>
  implements ISelectionDataPointValue
{
  @IsString({ each: true })
  @MaxLength(250, { each: true })
  @PropertyType([String])
  selection: Array<string>;

  @IsString()
  @MaxLength(250)
  @IsOptional()
  otherValue?: string;
}

@Expose()
export class SelectionDataPointModel<TID = string> extends DataPointModel<
  TID,
  SelectionDataPointModel<TID>
> {
  @PropertyType(SelectionDataPointValueModel)
  value: ISelectionDataPointValue;

  @IsEnum([DataPointValueType.Selection])
  valueType = DataPointValueType.Selection;
}

export function isSelectionDataPointConfig(
  config: IDataPointConfig,
): config is ISelectionDataPointConfig {
  return config.valueType === DataPointValueType.Selection;
}

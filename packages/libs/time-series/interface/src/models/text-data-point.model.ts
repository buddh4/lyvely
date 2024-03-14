import { Expose } from 'class-transformer';
import { DataPointModel } from './data-point.model';
import { DataPointValueType, ITextDataPointConfig, IDataPointConfig } from '../interfaces';
import { type BaseModelData, DocumentModel, PropertyType } from '@lyvely/common';

export class TextDataPointModel<TID = string> extends DataPointModel<TID> {
  @Expose()
  @PropertyType(String, { default: '' })
  override value: string;

  @Expose()
  override valueType = DataPointValueType.Text;

  constructor(data: BaseModelData<TextDataPointModel<any>>) {
    super(false);
    DocumentModel.init(this, data);
  }
}

export function isTextDataPointConfig(config: IDataPointConfig): config is ITextDataPointConfig {
  return config.valueType === DataPointValueType.Text;
}

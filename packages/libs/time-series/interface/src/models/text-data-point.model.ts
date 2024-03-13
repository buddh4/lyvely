import { Expose } from 'class-transformer';
import { DataPointModel } from './data-point.model';
import { DataPointValueType, ITextDataPointConfig, IDataPointConfig } from '../interfaces';

export class TextDataPointModel<TID = string> extends DataPointModel<TID> {
  @Expose()
  override value = '';

  @Expose()
  override valueType = DataPointValueType.Text;
}

export function isTextDataPointConfig(config: IDataPointConfig): config is ITextDataPointConfig {
  return config.valueType === DataPointValueType.Text;
}

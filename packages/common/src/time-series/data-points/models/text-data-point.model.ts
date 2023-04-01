import { Expose } from 'class-transformer';
import { DataPointModel } from './data-point.model';
import { DataPointValueType, ITextDataPointConfig, IDataPointConfig } from '../interfaces';

export class TextDataPointModel extends DataPointModel<TextDataPointModel> {
  @Expose()
  value: string;

  @Expose()
  valueType = DataPointValueType.Text;

  afterInit() {
    this.value = this.value ?? '';
  }
}

export function isTextDataPointConfig(config: IDataPointConfig): config is ITextDataPointConfig {
  return config.valueType === DataPointValueType.Text;
}

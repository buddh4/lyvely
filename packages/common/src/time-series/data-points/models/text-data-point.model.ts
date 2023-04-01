import { Expose } from 'class-transformer';
import { DataPointModel } from './data-point.model';
import {
  DataPointStrategy,
  DataPointValueType,
  IDataPointValueStatus,
  ITextDataPointConfig,
  IDataPointConfig,
  ITextDataPointConfigRevision,
} from '../interfaces';
import { useDataPointStrategyFacade } from '@/time-series/data-points';
import { PropertiesOf } from '@/utils';
import { isString } from 'class-validator';

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

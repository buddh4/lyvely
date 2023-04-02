import {
  DataPointValueType,
  ITextDataPointConfig,
  ITextDataPointConfigRevision,
} from '../interfaces';
import { useDataPointStrategyFacade } from '../components';
import { TextDataPointModel } from '../models';
import { PropertiesOf } from '@/utils';
import { isString } from 'class-validator';
import { DataPointStrategy } from './data-point.strategy';

export class TextDataPointService extends DataPointStrategy<
  TextDataPointModel,
  ITextDataPointConfig,
  ITextDataPointConfigRevision,
  string
> {
  createDataPoint(raw: PropertiesOf<TextDataPointModel>): TextDataPointModel {
    return new TextDataPointModel(raw);
  }

  getSettingKeys(): (keyof ITextDataPointConfig)[] {
    return ['required'];
  }

  prepareValue(config: ITextDataPointConfig, value: string): string {
    return isString(value) ? value?.trim() : value;
  }

  validateValue(config: ITextDataPointConfig, value: string): boolean {
    return isString(value) && !!value?.trim().length;
  }

  prepareConfig(config: ITextDataPointConfig): void {
    /** Nothing todo **/
  }
}

useDataPointStrategyFacade().registerType(DataPointValueType.Text, new TextDataPointService());

import {
  DataPointStrategy,
  DataPointValueType,
  IDataPointValueStatus,
  ITextDataPointConfig,
  ITextDataPointConfigRevision,
  TextDataPointModel,
  useDataPointStrategyFacade,
} from '@/time-series';
import { PropertiesOf } from '@/utils';
import { isString } from 'class-validator';

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

  getValueStatus(config: ITextDataPointConfig, value: string): IDataPointValueStatus {
    return config.required && !value ? 'warning' : '';
  }

  populateDataPointTypeSettings(
    target: Partial<ITextDataPointConfig>,
    config: ITextDataPointConfig,
  ) {
    target.required = config.required;
  }

  prepareValue(config: ITextDataPointConfig, value: string): string {
    return value?.trim();
  }

  validateValue(config: ITextDataPointConfig, value: string): boolean {
    return isString(value) && !!value.length;
  }

  prepareConfig(config: ITextDataPointConfig): void {
    /** Nothing todo **/
  }
}

useDataPointStrategyFacade().registerType(DataPointValueType.Text, new TextDataPointService());

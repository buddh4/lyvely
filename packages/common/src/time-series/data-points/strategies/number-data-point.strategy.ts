import {
  DataPointInputType,
  DataPointStrategy,
  DataPointValueType,
  IDataPointValueStatus,
  INumberDataPointConfig,
  INumberDataPointConfigRevision,
} from '../interfaces';
import { useDataPointStrategyFacade } from '../components';
import { NumberDataPointModel } from '../models';
import { PropertiesOf } from '@/utils';
import { isDefined, isNumber } from 'class-validator';

export class NumberDataPointService extends DataPointStrategy<
  NumberDataPointModel,
  INumberDataPointConfig,
  INumberDataPointConfigRevision,
  number
> {
  createDataPoint(raw: PropertiesOf<NumberDataPointModel>): NumberDataPointModel {
    return new NumberDataPointModel(raw);
  }

  getValueStatus(config: INumberDataPointConfig, value: any): IDataPointValueStatus {
    if (config.min && value <= config.min) return 'warning';
    if (config.optimal && value >= config.optimal!) return 'success';
    if (value) return 'success';
    return '';
  }

  validateValue(config: INumberDataPointConfig, value: number): boolean {
    return isNumber(value) && value <= config.max;
  }

  prepareValue(config: INumberDataPointConfig, value: number): number {
    return isDefined(config.max) ? Math.min(value, config.max) : value;
  }

  prepareConfig(config: INumberDataPointConfig): void {
    if (!isDefined(config.max) && config.inputType === DataPointInputType.Checkbox) {
      config.max = 1;
    }

    if (config.max && config.inputType === DataPointInputType.Checkbox) {
      config.max = Math.min(8, config.max);
    }
  }

  getSettingKeys(): Array<keyof INumberDataPointConfig> {
    return ['max', 'min', 'optimal'];
  }
}

useDataPointStrategyFacade().registerType(DataPointValueType.Number, new NumberDataPointService());

import {
  DataPointInputType,
  DataPointValueType,
  INumberDataPointConfig,
  INumberDataPointConfigRevision,
  INumberDataPointSettings,
} from '../interfaces';
import { useDataPointStrategyFacade } from '../components';
import { NumberDataPointModel } from '../models';
import { PropertiesOf, isNotNil, isNil } from '@lyvely/common';
import { isNumber } from 'class-validator';
import { DataPointStrategy } from './data-point.strategy';

export class NumberDataPointStrategy extends DataPointStrategy<
  NumberDataPointModel,
  INumberDataPointConfig,
  INumberDataPointConfigRevision,
  number
> {
  createDataPoint(raw: PropertiesOf<NumberDataPointModel>): NumberDataPointModel {
    return new NumberDataPointModel(raw);
  }

  async validateValue(config: INumberDataPointConfig, value: number) {
    return isNumber(value) && (isNil(config.max) || value <= config.max!);
  }

  prepareValue(config: INumberDataPointConfig, value: number) {
    return isNotNil(config.max) && isNumber(value) ? Math.min(value, config.max!) : value;
  }

  prepareConfig(config: INumberDataPointSettings) {
    if (isNotNil(config.optimal) && isNotNil(config.max) && config.optimal! > config.max!)
      config.optimal = config.max;
    if (isNotNil(config.min) && isNotNil(config.max) && config.min! > config.max!)
      config.min = config.max;
    if (isNotNil(config.min) && isNotNil(config.optimal) && config.min! > config.optimal!)
      config.optimal = config.min;

    if (isNil(config.max) && config.inputType === DataPointInputType.Checkbox) {
      config.max = 1;
    }

    if (config.max && config.inputType === DataPointInputType.Checkbox) {
      config.max = Math.min(8, config.max);
    }

    if (isNil(config.max) && config.inputType === DataPointInputType.Range) {
      config.max = 10;
    }
  }

  getSettingKeys(): Array<keyof INumberDataPointConfig> {
    return ['max', 'min', 'optimal'];
  }
}

useDataPointStrategyFacade().registerType(DataPointValueType.Number, new NumberDataPointStrategy());

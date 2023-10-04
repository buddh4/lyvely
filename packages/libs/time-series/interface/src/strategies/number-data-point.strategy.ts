import {
  DataPointInputType,
  DataPointValueType,
  INumberDataPointConfig,
  INumberDataPointConfigRevision,
  INumberDataPointSettings,
} from '../interfaces';
import { useDataPointStrategyFacade } from '../components';
import { NumberDataPointModel } from '../models';
import { PropertiesOf } from '@lyvely/common';
import { isDefined, isNumber } from 'class-validator';
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
    return isNumber(value) && (!isDefined(config.max) || value <= config.max!);
  }

  prepareValue(config: INumberDataPointConfig, value: number) {
    return isDefined(config.max) && isNumber(value) ? Math.min(value, config.max!) : value;
  }

  prepareConfig(config: INumberDataPointSettings) {
    if (isDefined(config.optimal) && isDefined(config.max) && config.optimal! > config.max!)
      config.optimal = config.max;
    if (isDefined(config.min) && isDefined(config.max) && config.min! > config.max!)
      config.min = config.max;
    if (isDefined(config.min) && isDefined(config.optimal) && config.min! > config.optimal!)
      config.optimal = config.min;

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

useDataPointStrategyFacade().registerType(DataPointValueType.Number, new NumberDataPointStrategy());

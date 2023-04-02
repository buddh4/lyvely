import {
  DataPointInputType,
  DataPointValueType,
  INumberDataPointConfig,
  INumberDataPointConfigRevision,
} from '../interfaces';
import { useDataPointStrategyFacade } from '../components';
import { NumberDataPointModel } from '../models';
import { PropertiesOf } from '@/utils';
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

  validateValue(config: INumberDataPointConfig, value: number): boolean {
    return isNumber(value) && value <= config.max;
  }

  prepareValue(config: INumberDataPointConfig, value: number): number {
    return isDefined(config.max) && isNumber(value) ? Math.min(value, config.max) : value;
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

useDataPointStrategyFacade().registerType(DataPointValueType.Number, new NumberDataPointStrategy());

import { DataPointConfig } from './config/data-point-config.schema';
import { assignEntityData } from '@/core';
import { Type, useDataPointStrategyFacade, IntegrityException, PropertiesOf } from '@lyvely/common';

const register = {};

export function registerDataPointStrategy<TClass extends DataPointConfig>(
  strategy: string,
  type: Type<TClass>,
) {
  register[strategy] = type;
}

export class DataPointConfigFactory {
  static initializeConfig<T extends DataPointConfig = DataPointConfig>(
    valueType: string,
    inputType: string,
    settings?: any,
  ): T {
    const strategy = DataPointConfigFactory.getStrategyName(valueType, inputType);
    const ConfigType = register[strategy];

    if (!ConfigType) {
      throw new IntegrityException(
        `Could not initialize data point config with strategy '${strategy}'`,
      );
    }

    const result = new ConfigType(settings);
    useDataPointStrategyFacade().prepareConfig(result);
    return result;
  }

  static getStrategyName(valueType: string, inputType: string) {
    return `${valueType}_${inputType}`;
  }

  static validateStrategyByName(strategy: string) {
    return !!register[strategy];
  }

  static instantiateConfig<T extends DataPointConfig = DataPointConfig>(
    config: PropertiesOf<T>,
  ): T {
    const strategy =
      config.strategy || DataPointConfigFactory.getStrategyName(config.valueType, config.inputType);

    const ConfigType = register[strategy];
    if (!ConfigType) {
      throw new IntegrityException(
        `Could not instantiate data point config with unregistered strategy '${strategy}'`,
      );
    }

    return assignEntityData(new ConfigType(), config);
  }
}

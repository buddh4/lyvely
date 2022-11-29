import { Logger } from '@nestjs/common';
import { DataPointConfig } from './data-point-config.schema';
import { assignEntityData } from '@/core';
import { Type } from '@lyvely/common';

const register = {};
const logger = new Logger('DataPointStrategyFactory');

export function registerDataPointStrategy<TClass extends DataPointConfig>(strategy: string, type: Type<TClass>) {
  register[strategy] = type;
}

export class DataPointConfigFactory {
  static createConfig<T extends DataPointConfig = DataPointConfig>(
    valueType: string,
    inputType: string,
    settings?: any,
  ): T {
    const strategy = DataPointConfigFactory.getStrategyName(valueType, inputType);
    const ConfigType = register[strategy];
    if (ConfigType) {
      return new ConfigType(settings);
    }
    logger.error(`Could not create unregistered data point strategy '${strategy}'`);
    return null;
  }

  static getStrategyName(valueType: string, inputType: string) {
    return `${valueType}_${inputType}`;
  }

  static createInstance<T extends DataPointConfig = DataPointConfig>(config: T): T {
    const strategy = config.strategy || DataPointConfigFactory.getStrategyName(config.valueType, config.inputType);
    const ConfigType = register[strategy];
    if (ConfigType) {
      return assignEntityData(new ConfigType(), config);
    }
    logger.error(`Could not create unregistered data point strategy '${strategy}'`);
    return null;
  }

  static getConstructorByStrategy(strategy: string) {
    return register[strategy];
  }
}

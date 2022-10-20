import { DataPointInputStrategy } from '@lyvely/common';
import { Logger } from '@nestjs/common';
import { DataPointConfig } from './data-point-config.schema';
import { assignEntityData } from '@/core';

type StrategyId = DataPointInputStrategy | string;

const register = {};
const logger = new Logger('DataPointStrategyFactory');

export interface IDataPointStrategyType<T extends DataPointConfig> extends Function {
  new (settings?: any): T;
}

export function registerDataPointStrategy<TClass extends DataPointConfig>(
  strategy: StrategyId,
  type: IDataPointStrategyType<TClass>,
) {
  logger.log(`Registered data point strategy '${strategy}'`);
  register[strategy] = type;
}

export class DataPointConfigFactory {
  static createConfig<T extends DataPointConfig = DataPointConfig>(strategy: StrategyId, settings?: any): T {
    const ConfigType = register[strategy];
    if (ConfigType) {
      return new ConfigType(settings);
    }
    logger.error(`Could not create unregistered data point strategy '${strategy}'`);
    return null;
  }

  static createInstance<T extends DataPointConfig = DataPointConfig>(strategy: StrategyId, config: T): T {
    const ConfigType = register[strategy];
    if (ConfigType) {
      return assignEntityData(new ConfigType(), config);
    }
    logger.error(`Could not create unregistered data point strategy '${strategy}'`);
    return null;
  }

  static getConstructorByStrategy(stratgy: StrategyId) {
    return register[stratgy];
  }
}

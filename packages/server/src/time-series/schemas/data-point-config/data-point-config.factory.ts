import { DataPointInputStrategy } from 'lyvely-common';
import { Logger } from '@nestjs/common';
import { AbstractTimeSeriesDataPointConfig } from './abstract-time-series-data-point.config';

type StrategyId = DataPointInputStrategy | string;

const register = {};
const logger = new Logger('DataPointStrategyFactory');

export interface DataPointStrategyType<T extends AbstractTimeSeriesDataPointConfig> extends Function {
  new (settings?: any): T;
}

export function registerDataPointStrategy<TClass extends AbstractTimeSeriesDataPointConfig>(strategy: StrategyId, type: DataPointStrategyType<TClass>) {
  logger.log(`Registered data point strategy '${strategy}'`);
  register[strategy] = type;
}

export class DataPointConfigFactory {
  static createConfig<T extends AbstractTimeSeriesDataPointConfig = AbstractTimeSeriesDataPointConfig>(strategy: StrategyId, settings?: any): T {
    const ConfigType = register[strategy];
    if(ConfigType) {
      return new ConfigType(settings)
    }
    logger.error(`Could not create unregistered data point strategy '${strategy}'`)
    return null;
  }
}


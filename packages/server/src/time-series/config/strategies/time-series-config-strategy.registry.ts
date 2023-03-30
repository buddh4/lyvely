import { useSingleton } from '@lyvely/common';
import { Logger } from '@nestjs/common';
import { ITimeSeriesConfigStrategy } from './time-series-config.strategy';

export class TimeSeriesConfigStrategyRegistry {
  private registry = new Map<string, ITimeSeriesConfigStrategy>();
  private logger = new Logger(TimeSeriesConfigStrategyRegistry.name);

  registerValueStrategy(valueType: string, strategy: ITimeSeriesConfigStrategy) {
    this.registry.set(valueType, strategy);
  }

  getStrategy(valueType: string) {
    const strategy = this.registry.get(valueType);
    if (!strategy) {
      this.logger.warn('No datapoint strategy registered for value type ' + valueType);
    }
    return strategy;
  }
}

export const useDataPointConfigStrategyRegistry = useSingleton(
  () => new TimeSeriesConfigStrategyRegistry(),
);

import { useSingleton } from '@lyvely/common';
import { Logger } from '@nestjs/common';
import { TimeSeriesConfigStrategy } from '@/time-series';

export class TimeSeriesConfigStrategyRegistry {
  private registry = new Map<string, TimeSeriesConfigStrategy>();
  private logger = new Logger(TimeSeriesConfigStrategyRegistry.name);

  registerValueStrategy(valueType: string, strategy: TimeSeriesConfigStrategy) {
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

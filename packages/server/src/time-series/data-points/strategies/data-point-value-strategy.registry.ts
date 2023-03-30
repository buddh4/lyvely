import { useSingleton } from '@lyvely/common';
import { IDataPointValueStrategy } from '@/time-series/data-points/strategies/data-point-value.strategy';
import { Logger } from '@nestjs/common';

export class DataPointValueStrategyRegistry {
  private registry = new Map<string, IDataPointValueStrategy>();
  private logger = new Logger(DataPointValueStrategyRegistry.name);

  registerValueStrategy(valueType: string, strategy: IDataPointValueStrategy) {
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

export const useDataPointValueStrategyRegistry = useSingleton(
  () => new DataPointValueStrategyRegistry(),
);

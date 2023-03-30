import { useSingleton } from '@lyvely/common';
import { DataPointValueStrategy } from '@/time-series/data-points/interfaces/data-point-value.strategy';
import { Logger } from '@nestjs/common';

export class DataPointValueStrategyRegistry {
  private registry = new Map<string, DataPointValueStrategy>();
  private logger = new Logger(DataPointValueStrategyRegistry.name);

  registerValueStrategy(valueType: string, strategy: DataPointValueStrategy) {
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

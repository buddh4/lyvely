import { useSingleton } from '@lyvely/common';
import { IDataPointProcessorStrategy } from './data-point-processor.strategy';
import { Logger } from '@nestjs/common';

export class DataPointProcessorStrategyRegistry {
  private registry = new Map<string, IDataPointProcessorStrategy>();
  private logger = new Logger(DataPointProcessorStrategyRegistry.name);

  registerValueStrategy(valueType: string, strategy: IDataPointProcessorStrategy) {
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

export const useDataPointStrategyRegistry = useSingleton(
  () => new DataPointProcessorStrategyRegistry(),
);

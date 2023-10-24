import { useSingleton } from '@lyvely/common';
import { IDataPointProcessorStrategy } from './data-point-processor.strategy';

export class DataPointProcessorStrategyRegistry {
  private registry = new Map<string, IDataPointProcessorStrategy>();

  registerValueStrategy(valueType: string, strategy: IDataPointProcessorStrategy) {
    this.registry.set(valueType, strategy);
  }

  getStrategy(valueType: string) {
    return this.registry.get(valueType);
  }
}

export const useDataPointStrategyRegistry = useSingleton(
  () => new DataPointProcessorStrategyRegistry(),
);

import { DataPointModel } from '@/time-series';
import { PropertiesOf, Type, useSingleton } from '@/utils';

export class DataPointFactory {
  private types: Map<string, Type<DataPointModel>>;

  registerType(valueType: string, type: Type<DataPointModel>) {
    this.types.set(valueType, type);
  }

  createDataPoint(raw: PropertiesOf<DataPointModel>) {
    const Constructor = this.types.get(raw.valueType);
    return new Constructor(raw);
  }
}

export const useDataPointFactory = useSingleton(() => new DataPointFactory());

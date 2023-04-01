import { DataPointModel } from '../models';
import { PropertiesOf, useSingleton } from '@/utils';
import { IDataPointConfig, IDataPointStrategy, IDataPointValueStatus } from '@/time-series';

export class DataPointStrategyFacade {
  private types = new Map<string, IDataPointStrategy>();

  registerType(valueType: string, type: IDataPointStrategy) {
    this.types.set(valueType, type);
  }

  getService(valueType: string) {
    return this.types.get(valueType);
  }

  getValueStatus(config: IDataPointConfig, value: any): IDataPointValueStatus {
    return this.getService(config.valueType).getValueStatus(config, value);
  }

  getSettingKeys(valueType: string) {
    return this.getService(valueType).getSettingKeys();
  }

  populateDataPointConfig(
    target: Partial<IDataPointConfig>,
    config: IDataPointConfig,
  ): IDataPointValueStatus {
    return this.getService(config.valueType).populateDataPointConfig(target, config);
  }

  createDataPoint(raw: PropertiesOf<DataPointModel>): DataPointModel {
    return this.getService(raw.valueType).createDataPoint(raw);
  }

  createRevision(config: IDataPointConfig) {
    return this.getService(config.valueType).createRevision(config);
  }
}

export const useDataPointStrategyFacade = useSingleton(() => new DataPointStrategyFacade());

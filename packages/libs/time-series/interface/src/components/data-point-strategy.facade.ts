import { PropertiesOf, useSingleton, IntegrityException } from '@lyvely/common';
import { IDataPoint, IDataPointConfig, IDataPointStrategy } from '../interfaces';

export class DataPointStrategyFacade {
  private types = new Map<string, IDataPointStrategy>();

  registerType(valueType: string, type: IDataPointStrategy) {
    this.types.set(valueType, type);
  }

  getService(valueType: string) {
    const service = this.types.get(valueType);
    if (!service) {
      throw new IntegrityException('Unknown data point strategy value type ' + valueType);
    }
    return service;
  }

  getSettingKeys(valueType: string) {
    return this.getService(valueType).getSettingKeys();
  }

  populateDataPointConfig(target: Partial<IDataPointConfig>, config: IDataPointConfig) {
    return this.getService(config.valueType).populateDataPointConfig(target, config);
  }

  createDataPoint(raw: PropertiesOf<IDataPoint>): IDataPoint {
    return this.getService(raw.valueType).createDataPoint(raw);
  }

  async validateValue(config: IDataPointConfig, value: any) {
    return this.getService(config.valueType).validateValue(config, value);
  }

  prepareValue(config: IDataPointConfig, value: any) {
    return this.getService(config.valueType).prepareValue(config, value);
  }

  prepareConfig(config: IDataPointConfig) {
    return this.getService(config.valueType).prepareConfig(config);
  }

  createRevision(config: IDataPointConfig) {
    return this.getService(config.valueType).createRevision(config);
  }
}

export const useDataPointStrategyFacade = useSingleton(() => new DataPointStrategyFacade());

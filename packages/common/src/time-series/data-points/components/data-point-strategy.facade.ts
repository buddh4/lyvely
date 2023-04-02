import { DataPointModel } from '../models';
import { PropertiesOf, useSingleton } from '@/utils';
import { IDataPointConfig, IDataPointStrategy, IDataPointValueStatus } from '../interfaces';
import { IntegrityException } from '@/exceptions';

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

  populateDataPointConfig(
    target: Partial<IDataPointConfig>,
    config: IDataPointConfig,
  ): IDataPointValueStatus {
    return this.getService(config.valueType).populateDataPointConfig(target, config);
  }

  createDataPoint(raw: PropertiesOf<DataPointModel>): DataPointModel {
    return this.getService(raw.valueType).createDataPoint(raw);
  }

  validateValue(config: IDataPointConfig, value: any): boolean {
    return this.getService(config.valueType).validateValue(config, value);
  }

  prepareValue(config: IDataPointConfig, value: any): boolean {
    return this.getService(config.valueType).prepareValue(config, value);
  }

  prepareConfig(config: IDataPointConfig): void {
    this.getService(config.valueType).prepareConfig(config);
  }

  createRevision(config: IDataPointConfig) {
    return this.getService(config.valueType).createRevision(config);
  }
}

export const useDataPointStrategyFacade = useSingleton(() => new DataPointStrategyFacade());

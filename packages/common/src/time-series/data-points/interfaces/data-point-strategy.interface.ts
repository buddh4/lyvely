import { IDataPoint, IDataPointConfig, IDataPointConfigRevision } from './data-point.interface';
import { PropertiesOf } from '@/utils';

export type IDataPointValueStatus = 'success' | 'warning' | 'info' | '';

export interface IDataPointStrategy<
  T extends IDataPoint<TValue> = IDataPoint,
  TConfig extends IDataPointConfig = any,
  TRev extends IDataPointConfigRevision = IDataPointConfigRevision,
  TValue = any,
> {
  getValueStatus(config: TConfig, value: TValue): IDataPointValueStatus;
  getSettingKeys(): Array<keyof TConfig>;
  validateValue(config: TConfig, value: TValue): boolean;
  prepareValue(config: TConfig, value: TValue): TValue;
  prepareConfig(config: TConfig): void;
  createDataPoint(raw: PropertiesOf<T>): T;
  createRevision(config: TConfig): TRev;
  populateDataPointTypeSettings(target: Partial<TConfig>, config: TConfig);
  populateDataPointConfig(target: Partial<TConfig>, config: TConfig, history?: boolean);
}

export abstract class DataPointStrategy<
  T extends IDataPoint<TValue> = IDataPoint,
  TConfig extends IDataPointConfig = IDataPointConfig,
  TRev extends IDataPointConfigRevision = IDataPointConfigRevision,
  TValue = any,
> implements IDataPointStrategy<T, TConfig, TRev, TValue>
{
  abstract getValueStatus(config: TConfig, value: TValue): IDataPointValueStatus;
  abstract getSettingKeys(): Array<keyof TConfig>;
  abstract validateValue(config: TConfig, value: TValue): boolean;
  abstract prepareValue(config: TConfig, value: TValue): TValue;
  abstract prepareConfig(config: TConfig): void;
  abstract createDataPoint(raw: PropertiesOf<T>): T;

  createRevision(config: TConfig): TRev {
    const rev = {
      validUntil: new Date(),
      interval: config.interval,
      inputType: config.inputType,
      valueType: config.valueType,
    } as any;
    this.populateDataPointTypeSettings(rev as any, config);
    return rev;
  }

  populateDataPointTypeSettings(target: Partial<TConfig>, config: TConfig) {
    for (const key in this.getSettingKeys()) {
      target[key] = config[key];
    }
  }

  populateDataPointConfig(target: Partial<TConfig>, config: TConfig, history = false) {
    target.interval = config.interval;
    target.inputType = config.inputType;
    target.userStrategy = config.userStrategy;
    target.valueType = config.valueType;
    if (history) {
      target.history = config.history;
    }
    this.populateDataPointTypeSettings(target, config);
  }
}

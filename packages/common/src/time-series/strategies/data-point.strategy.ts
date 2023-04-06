import {
  IDataPoint,
  IDataPointConfig,
  IDataPointConfigRevision,
  IDataPointStrategy,
} from '../interfaces';
import { PropertiesOf } from '@/utils';

export abstract class DataPointStrategy<
  T extends IDataPoint<TValue> = IDataPoint,
  TConfig extends IDataPointConfig = IDataPointConfig,
  TRev extends IDataPointConfigRevision = IDataPointConfigRevision,
  TValue = any,
> implements IDataPointStrategy<T, TConfig, TRev, TValue>
{
  abstract getSettingKeys(): Array<keyof TConfig>;
  abstract validateValue(config: TConfig, value: TValue): Promise<boolean>;
  abstract prepareValue(config: TConfig, value: TValue, oldValue?: TValue): TValue;
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
    for (const key of this.getSettingKeys()) {
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

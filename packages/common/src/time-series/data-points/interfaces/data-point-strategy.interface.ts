import { IDataPoint, IDataPointConfig, IDataPointConfigRevision } from './data-point.interface';
import { PropertiesOf } from '@/utils';

export interface IDataPointStrategy<
  T extends IDataPoint<TValue> = IDataPoint,
  TConfig extends IDataPointConfig = any,
  TRev extends IDataPointConfigRevision = IDataPointConfigRevision,
  TValue = any,
> {
  getSettingKeys(): Array<keyof TConfig>;
  validateValue(config: TConfig, value: TValue): Promise<boolean>;
  prepareValue(config: TConfig, value: TValue, oldValue?: TValue): TValue;
  prepareConfig(config: TConfig): void;
  createDataPoint(raw: PropertiesOf<T>): T;
  createRevision(config: TConfig): TRev;
  populateDataPointTypeSettings(target: Partial<TConfig>, config: TConfig);
  populateDataPointConfig(target: Partial<TConfig>, config: TConfig, history?: boolean);
}

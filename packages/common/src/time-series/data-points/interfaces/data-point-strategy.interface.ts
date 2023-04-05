import { IDataPoint, IDataPointConfig, IDataPointConfigRevision } from './data-point.interface';
import { PropertiesOf } from '@/utils';

/**
 * This interface is used to describe the behavior of different DataPoint value types. This is especially used for
 * validation and sanitation and to enforce DataPoint value type specific rules.
 */
export interface IDataPointStrategy<
  T extends IDataPoint<TValue> = IDataPoint,
  TConfig extends IDataPointConfig = any,
  TRev extends IDataPointConfigRevision = IDataPointConfigRevision,
  TValue = any,
> {
  /**
   * Returns an array of DataPoint specific setting keys or an empty array in case the DataPoint value tpye does not
   * provide any specific configuration options.
   */
  getSettingKeys(): Array<keyof TConfig>;

  /**
   * Validates the DataPoint value by means of the given configuration.
   * @param config The configuration related to the TimeSeriesContent
   * @param value The value to be tested
   */
  validateValue(config: TConfig, value: TValue): Promise<boolean>;

  /**
   * Returns a sanitized or updated version of the given value. This may be used to set default values or enforce input type
   * specific rules and boundaries.
   * @param config The configuration related to the TimeSeriesContent
   * @param value The value to be tested
   * @param oldValue An old value present for update calls
   */
  prepareValue(config: TConfig, value: TValue, oldValue?: TValue): TValue;

  /**
   * Can be used to sanitize the given configuration and enforce input type specific rules and boundaries.
   * @param config The configuration related to the TimeSeriesContent
   */
  prepareConfig(config: TConfig): void;

  /**
   * Returns an instance of the DataPointModel related with this DataPoint strategy.
   * @param raw
   */
  createDataPoint(raw: PropertiesOf<T>): T;

  /**
   * Returns a revision for the given DataPointConfig
   * @param config
   */
  createRevision(config: TConfig): TRev;

  /**
   * Populates the given config settings into the target.
   * @param target
   * @param config
   */
  populateDataPointTypeSettings(target: Partial<TConfig>, config: TConfig);

  /**
   * Populates the whole configuration into the target. If history is set to true, also the history will
   * be taken over.
   * @param target
   * @param config
   * @param history
   */
  populateDataPointConfig(target: Partial<TConfig>, config: TConfig, history?: boolean);
}

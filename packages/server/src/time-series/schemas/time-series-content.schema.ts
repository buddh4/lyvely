import { IContent, ITimeSeriesContentConfig } from '@lyvely/common';
import { ContentEntity, ContentType } from '@/content';
import { DataPointConfigFactory } from './data-point-config.factory';
import { DataPointConfig, DefaultDataPointConfig } from './config/data-point-config.schema';
import { EntityType } from '@/core';

export type TimeSeriesContentEntity<
  T,
  TConfig extends ITimeSeriesContentConfig = any,
> = ContentEntity<T, TConfig>;

/**
 * This class serves as base class for all time series content types and schemas. A subclass usually overwrites the
 * `config` schema type either with a custom or a predefined one as NumberDataPointConfig as well as overwriting
 * `dataPointConfigHistory` schema.
 */
export abstract class TimeSeriesContent<
  TContent extends TimeSeriesContentEntity<TContent, TConfig>,
  TDataPointConfig extends DefaultDataPointConfig = DefaultDataPointConfig,
  TConfig extends ITimeSeriesContentConfig<TDataPointConfig> = ITimeSeriesContentConfig<TDataPointConfig>,
> extends ContentType<TContent, TConfig> {
  config: TConfig;

  get timeSeriesConfig() {
    return this.config?.timeSeries;
  }

  set timeSeriesConfig(config: TDataPointConfig) {
    if (!this.config) {
      this.config = <any>{};
    }
    this.config.timeSeries = config;
  }

  get interval() {
    return this.timeSeriesConfig.interval;
  }

  afterInit() {
    // in case plain object is given we create a class instance
    if (!(this.timeSeriesConfig instanceof DataPointConfig)) {
      this.timeSeriesConfig = DataPointConfigFactory.createInstance(this.timeSeriesConfig);
    }

    super.afterInit();
  }
}

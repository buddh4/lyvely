import { ITimeSeriesContentConfig } from '@lyvely/common';
import { IContentEntity, ContentType } from '@/content';
import { DataPointConfigFactory } from '@/time-series/components';
import { DataPointConfig, DefaultDataPointConfig } from '@/time-series/schemas';
import { EntityType } from '@/core';

type TimeSeriesContentEntity = IContentEntity & EntityType<TimeSeriesContent>;

/**
 * This class serves as base class for all time series content types and schemas. A subclass usually overwrites the
 * `config` schema type either with a custom or a predefined one as NumberDataPointConfig as well as overwriting
 * `dataPointConfigHistory` schema.
 */
export abstract class TimeSeriesContent<
  TContent extends TimeSeriesContentEntity = TimeSeriesContentEntity,
  TDataPointConfig extends DefaultDataPointConfig = DefaultDataPointConfig,
> extends ContentType<TContent> {
  config: ITimeSeriesContentConfig<TDataPointConfig>;

  get timeSeriesConfig() {
    return this.config?.timeSeries;
  }

  set timeSeriesConfig(config: TDataPointConfig) {
    if (!this.config) {
      this.config = <any>{};
    }
    this.config.timeSeries = config;
  }

  afterInit() {
    // in case plain object is given we create a class instance
    if (!(this.timeSeriesConfig instanceof DataPointConfig)) {
      this.timeSeriesConfig = DataPointConfigFactory.createInstance(this.timeSeriesConfig);
    }

    super.afterInit();
  }
}

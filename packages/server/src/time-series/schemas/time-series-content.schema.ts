import {
  ITimeSeriesContentConfig,
  CalendarInterval,
  BaseModel,
  PropertyType,
  ITimeSeriesContent,
  ITimeSeriesSummary,
  ITimeSeriesSummaryWindowEntry,
} from '@lyvely/common';
import { ContentEntity, ContentType } from '@/content';
import { DataPointConfigFactory } from './data-point-config.factory';
import { DataPointConfig, DefaultDataPointConfig } from './config/data-point-config.schema';
import { NestedSchema } from '@lyvely/core';
import { Prop, SchemaFactory } from '@nestjs/mongoose';

export type TimeSeriesContentEntity<
  T,
  TConfig extends ITimeSeriesContentConfig = any,
> = ContentEntity<T, TConfig>;

@NestedSchema()
export class TimeSeriesSummaryWindowEntry
  extends BaseModel<TimeSeriesSummaryWindowEntry>
  implements ITimeSeriesSummaryWindowEntry
{
  @Prop({ required: true })
  tid: string;

  @Prop({ required: true })
  value: number;

  constructor(tid: string, value: number) {
    super({ tid, value });
  }
}

const TimeSeriesSummaryWindowEntrySchema = SchemaFactory.createForClass(
  TimeSeriesSummaryWindowEntry,
);

@NestedSchema()
export class TimeSeriesSummary implements ITimeSeriesSummary {
  @Prop({ type: [TimeSeriesSummaryWindowEntrySchema] })
  @PropertyType([TimeSeriesSummaryWindowEntry])
  window: TimeSeriesSummaryWindowEntry[];
}

const TimeSeriesSummarySchema = SchemaFactory.createForClass(TimeSeriesSummary);

/**
 * This class serves as base class for all time series content types and schemas. A subclass usually overwrites the
 * `config` schema type either with a custom or a predefined one as NumberDataPointConfig as well as overwriting
 * `dataPointConfigHistory` schema.
 */
export abstract class TimeSeriesContent<
    TContent extends TimeSeriesContentEntity<TContent, TConfig>,
    TDataPointConfig extends DefaultDataPointConfig = DefaultDataPointConfig,
    TConfig extends ITimeSeriesContentConfig<TDataPointConfig> = ITimeSeriesContentConfig<TDataPointConfig>,
  >
  extends ContentType<TContent, TConfig>
  implements ITimeSeriesContent<TDataPointConfig>
{
  config: TConfig;

  @Prop({ type: TimeSeriesSummarySchema })
  @PropertyType(TimeSeriesSummary)
  timeSeriesSummary: TimeSeriesSummary;

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

  set interval(interval: CalendarInterval) {
    this.timeSeriesConfig.interval = interval;
  }

  afterInit() {
    // in case plain object is given we create a class instance
    if (this.timeSeriesConfig && !(this.timeSeriesConfig instanceof DataPointConfig)) {
      this.timeSeriesConfig = DataPointConfigFactory.instantiateConfig(this.timeSeriesConfig);
    }

    super.afterInit();
  }
}

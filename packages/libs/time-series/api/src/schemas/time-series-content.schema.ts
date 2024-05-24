import { PropertyType } from '@lyvely/common';
import { CalendarInterval } from '@lyvely/dates';
import {
  ITimeSeriesContent,
  ITimeSeriesContentConfig,
  ITimeSeriesSummary,
  ITimeSeriesSummaryWindowEntry,
} from '@lyvely/time-series-interface';
import { ContentModel, ContentType, NestedSchema, TObjectId, ContentDataType } from '@lyvely/api';
import { DataPointConfigFactory } from './data-point-config.factory';
import { DataPointConfig, DefaultDataPointConfig } from './config/data-point-config.schema';
import { Prop, SchemaFactory } from '@nestjs/mongoose';
import type { ICalendarPlanEntry } from '@lyvely/calendar-plan';

@NestedSchema()
export class TimeSeriesSummaryWindowEntry implements ITimeSeriesSummaryWindowEntry {
  @Prop({ required: true })
  tid: string;

  @Prop({ required: true })
  value: number;

  constructor(tid: string, value: number) {
    this.tid = tid;
    this.value = value;
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
    TDataPointConfig extends DefaultDataPointConfig = DefaultDataPointConfig,
    TConfig extends
      ITimeSeriesContentConfig<TDataPointConfig> = ITimeSeriesContentConfig<TDataPointConfig>,
    TState extends Object | undefined = undefined,
    TData extends ContentDataType = ContentDataType,
    TModel extends ContentModel<string> = ContentModel,
  >
  extends ContentType<TConfig, TState, TData, TModel>
  implements
    ITimeSeriesContent<TObjectId, TDataPointConfig>,
    ICalendarPlanEntry<TObjectId, TConfig, TState, TData>
{
  @Prop({ type: TimeSeriesSummarySchema })
  @PropertyType(TimeSeriesSummary)
  timeSeriesSummary: TimeSeriesSummary;

  get timeSeriesConfig() {
    return this.config!.timeSeries;
  }

  set timeSeriesConfig(config: TDataPointConfig) {
    if (!this.config) {
      this.config = <any>{};
    }
    this.config!.timeSeries = config;
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
  }
}

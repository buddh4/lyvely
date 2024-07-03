import { PropertyType } from '@lyvely/common';
import { CalendarInterval } from '@lyvely/dates';
import {
  ITimeSeriesContent,
  ITimeSeriesContentConfig,
  ITimeSeriesSummary,
  ITimeSeriesSummaryWindowEntry,
} from '@lyvely/time-series-interface';
import {
  ContentType,
  NestedSchema,
  TObjectId,
  ContentDataType,
  ObjectIdProp,
  UserAssignmentStrategy,
} from '@lyvely/api';
import { DataPointConfigFactory } from './data-point-config.factory';
import { DataPointConfig } from './config/data-point-config.schema';
import { Prop, SchemaFactory } from '@nestjs/mongoose';
import type { ICalendarPlanEntry } from '@lyvely/calendar-plan';
import { type ITimeSeriesState, TimeSeriesContentModel } from '@lyvely/time-series-interface';
import { BaseModel, type BaseModelData } from '@lyvely/common';
import { assureObjectId, type DocumentIdentity, User } from '@lyvely/api';

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
  TimeSeriesSummaryWindowEntry
);

@NestedSchema()
export class TimeSeriesSummary implements ITimeSeriesSummary<TObjectId> {
  @ObjectIdProp()
  uid: TObjectId | null;

  @Prop({ type: [TimeSeriesSummaryWindowEntrySchema] })
  @PropertyType([TimeSeriesSummaryWindowEntry])
  window: TimeSeriesSummaryWindowEntry[];

  /**
   * Finds a window in the existing window list based on the specified tid.
   *
   * @param {string} tid - The tid of the window to find.
   * @returns {object | undefined} - The found window object or undefined if not found.
   */
  findWindow(tid: string) {
    return this.window.find((entry) => entry.tid === tid);
  }

  /**
   * Upserts the value of a window entry and returns true if the value was updated and false if the
   * existing value equals the given value.
   *
   * @param {string} tid - The timing id.
   * @param {number} value - The value to be assigned to the window entry.
   * @returns {boolean} - Returns true if the value was updated and false if the existing value equals the given value.
   */
  upsertWindow(tid: string, value: number): boolean {
    const window = this.findWindow(tid);
    if (window && window.value === value) return false;

    if (window) window.value = value;
    else this.window.push(new TimeSeriesSummaryWindowEntry(tid, value));

    return true;
  }

  /**
   * Clears the entries not included in the given window.
   *
   * @param {string[]} tidWindow - An array of TIDs to clear.
   * @return {void} - No return value.
   */
  clearByTidWindow(tidWindow: string[]) {
    this.window = this.window
      .filter((entry) => tidWindow.includes(entry.tid))
      .sort((a, b) => {
        const indexA = tidWindow.findIndex((tid) => tid === a.tid);
        const indexB = tidWindow.findIndex((tid) => tid === b.tid);
        return indexA - indexB;
      });
  }

  constructor(data?: BaseModelData<TimeSeriesSummary>) {
    BaseModel.init(this, data);
  }
}

const TimeSeriesSummarySchema = SchemaFactory.createForClass(TimeSeriesSummary);

@NestedSchema()
export class TimeSeriesState implements ITimeSeriesState<TObjectId> {
  @Prop({ type: [TimeSeriesSummarySchema] })
  @PropertyType([TimeSeriesSummary])
  summaries: TimeSeriesSummary[];
}

const TimeSeriesStateSchema = SchemaFactory.createForClass(TimeSeriesState);

/**
 * This class serves as base class for all time series content types and schemas. A subclass usually overwrites the
 * `config` schema type either with a custom or a predefined one as NumberDataPointConfig as well as overwriting
 * `dataPointConfigHistory` schema.
 */
export abstract class TimeSeriesContent<
    TConfig extends
      ITimeSeriesContentConfig<DataPointConfig> = ITimeSeriesContentConfig<DataPointConfig>,
    TState extends TimeSeriesState = TimeSeriesState,
    TData extends ContentDataType = ContentDataType,
    TModel extends TimeSeriesContentModel<any> = TimeSeriesContentModel<any>,
  >
  extends ContentType<TConfig, TState, TData, TModel>
  implements
    ITimeSeriesContent<TObjectId, TConfig>,
    ICalendarPlanEntry<TObjectId, TConfig, TState, TData>
{
  @Prop({ type: TimeSeriesStateSchema })
  @PropertyType(TimeSeriesState)
  override state: TState;

  getSummary(user?: DocumentIdentity<User>) {
    const uid = assureObjectId(user, true);
    return this.timeSeriesConfig.userStrategy === UserAssignmentStrategy.PerUser
      ? this.state.summaries.find((s) => s.uid && s.uid.equals(uid))
      : this.state.summaries.find((s) => s.uid === null);
  }

  get timeSeriesConfig(): TConfig['timeSeries'] {
    return this.config!.timeSeries;
  }

  set timeSeriesConfig(config: TConfig['timeSeries']) {
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

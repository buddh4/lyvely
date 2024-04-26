import type { AccumulatorOperator, PipelineStage } from 'mongoose';
import { ChartSeriesAccumulation } from '@lyvely/analytics-interface';
import { CalendarPreferences, TObjectId } from '@lyvely/api';
import type { TimeSeriesAggregationInterval } from '@lyvely/analytics-interface';

export interface IntervalAggregationFilter {
  uids?: TObjectId[];
}

export interface IntervalAggregationOptions {
  /** The name of the resulting series. **/
  name: string;
  /** Aggregation interval **/
  interval: TimeSeriesAggregationInterval;
  /** Initial $match filter. **/
  $match: PipelineStage.Match['$match'];
  /** Defines how the accumulationField should be accumulated. **/
  accumulator: ChartSeriesAccumulation;
  /** Defines the field name used for the aggregation value accumulation. **/
  accumulationField: string;
  /** Defines the field name containing the required date object. Default: `date`. **/
  dateField?: string;
  /** Defines the field name containing the optional uid object. Default: `uid`. This document field required for uid filter support. **/
  uidField?: string;
  /** A locale string, used for timing related calculations. **/
  locale: string;
  /** An optional calendar preferences object, used for timing related calculations. **/
  preferences?: CalendarPreferences;
  /** The startDate can be used instead of the range to set the start of the interval. **/
  startDate?: Date;
  /** The endDate used to calculate the aggregation date range. **/
  endDate?: Date;
  /** The interval range used to calculate the aggregation date range. **/
  range?: number;
  /** Additional filter options. **/
  filter?: IntervalAggregationFilter;
}

/**
 * Represents an abstract helper class for interval aggregation.
 * @abstract
 */
export abstract class IntervalAggregation {
  protected options: IntervalAggregationOptions;

  constructor(options: IntervalAggregationOptions) {
    this.options = options;
  }

  /**
   * Specifies the group key. This is usually a field name with $ prefix e.g. $year.
   * @protected
   */
  protected abstract getGroupId(): PipelineStage.Group['$group']['_id'];

  /**
   * Specifies the $match filter of the aggregation.
   * @protected
   */
  protected abstract getMatchFilter(): PipelineStage.Match['$match'];

  /**
   * Specifies the $sort of the aggregation.
   * @protected
   */
  protected abstract getSort(): PipelineStage.Sort['$sort'];

  build(): [PipelineStage.Match, PipelineStage.Group, PipelineStage.Sort] {
    const match = this.getMatchFilter();

    if (this.options.filter?.uids?.length) {
      match[this.getUidField()] = { $in: this.options.filter.uids };
    }

    const $match = { $match: { ...this.options.$match, ...this.getMatchFilter() } };
    const $group = { $group: this.getGroup() };
    const $sort = { $sort: this.getSort() };
    return [$match, $group, $sort];
  }

  protected getGroup(): PipelineStage.Group['$group'] {
    const _id = this.getGroupId();

    if (this.options.filter?.uids?.length) {
      _id['uid'] = `$${this.getUidField()}`;
    }

    return {
      _id,
      value: this.getGroupAggregationValue(),
    };
  }

  protected getGroupAggregationValue(): AccumulatorOperator {
    const $accumulationField = `$${this.options.accumulationField}`;
    switch (this.options.accumulator) {
      case ChartSeriesAccumulation.Sum:
        return { $sum: $accumulationField };
      case ChartSeriesAccumulation.Avg:
        return { $avg: $accumulationField };
    }
  }

  protected getDateField(): string {
    return this.options.dateField || 'date';
  }

  protected getUidField(): string {
    return this.options.dateField || 'uid';
  }
}

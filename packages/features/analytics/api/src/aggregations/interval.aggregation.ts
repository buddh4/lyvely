import type { AccumulatorOperator, PipelineStage } from 'mongoose';
import { ChartSeriesAccumulation } from '@lyvely/analytics-interface';
import { CalendarPreferences, Content, type DocumentIdentity, Tag, type User } from '@lyvely/api';
import type { TimeSeriesAggregationInterval } from '@lyvely/analytics-interface';
import { assureObjectId } from '@lyvely/api';

export interface IntervalAggregationFilter {
  uids?: DocumentIdentity<User>[];
  tagIds?: DocumentIdentity<Tag>[];
  cid?: DocumentIdentity<Content>;
  contentType?: string;
}

export interface IntervalAggregationOptions {
  /** The name of the resulting series. **/
  name: string;
  /** The color of the resulting series. **/
  color?: string;
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
  /** Defines the field name containing the optional uid. Default: `uid`. This document field required for uid filter support. **/
  uidField?: string;
  /** Defines the field name containing the optional tagId array. Default: `tagIds`. This document field required for tagIds filter support. **/
  tagIdField?: string;
  /** Defines the field name containing the optional cid. Default: `cid`. This document field required for cid filter support. **/
  cidField?: string;
  /** Defines the field name containing the optional content type. Default: `contentType`. This document field required for contentType filter support. **/
  contentTypeField?: string;
  /** A locale string, used for timing related calculations. **/
  locale: string;
  /** The timezone used to calculate the date ranges. **/
  timezone: string;
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
      match[this.getUidField()] = {
        $in: this.options.filter.uids.map((uid) => assureObjectId(uid)),
      };
    }

    if (this.options.filter?.tagIds?.length) {
      match[this.getTagIdField()] = {
        $all: this.options.filter.tagIds.map((tagId) => assureObjectId(tagId)),
      };
    }

    if (this.options.filter?.cid) {
      match[this.getContentIdField()] = assureObjectId(this.options.filter.cid);
    }

    if (this.options.filter?.contentType) {
      match[this.getContentTypeField()] = this.options.filter.contentType;
    }

    const $match = { $match: { ...this.options.$match, ...match } };
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
    return this.options.uidField || 'uid';
  }

  protected getTagIdField(): string {
    return this.options.tagIdField || 'tagIds';
  }

  protected getContentIdField(): string {
    return this.options.cidField || 'cid';
  }

  protected getContentTypeField(): string {
    return this.options.cidField || 'contentType';
  }
}

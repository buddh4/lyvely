import type { AccumulatorOperator, PipelineStage } from 'mongoose';
import { ChartSeriesAccumulation } from '@lyvely/analytics-interface';
import { CalendarPreferences } from '@lyvely/api';
import { CalendarInterval } from '@lyvely/dates';

export interface IntervalAggregationOptions {
  interval: CalendarInterval;
  accumulator: ChartSeriesAccumulation;
  accumulationField: string;
  $match: PipelineStage.Match['$match'];
  locale: string;
  preferences: CalendarPreferences;
  endDate?: Date;
  range?: number;
  dateField?: string;
}

export abstract class IntervalAggregation {
  protected options: IntervalAggregationOptions;

  constructor(options: IntervalAggregationOptions) {
    this.options = options;
  }

  protected abstract getGroupId(): PipelineStage.Group['$group']['_id'];
  protected abstract getMatchFilter(): PipelineStage.Match['$match'];
  protected abstract getSort(): PipelineStage.Sort['$sort'];

  build(): [PipelineStage.Group, PipelineStage.Match, PipelineStage.Sort] {
    const $match = { $match: { ...this.options.$match, ...this.getMatchFilter() } };
    const $group = { $group: this.getGroup() };
    const $sort = { $sort: this.getSort() };
    return [$group, $match, $sort];
  }

  protected getGroup(): PipelineStage.Group['$group'] {
    return {
      _id: this.getGroupId(),
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
}

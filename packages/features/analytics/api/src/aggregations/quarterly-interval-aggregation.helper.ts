import type { PipelineStage } from 'mongoose';
import { subtractQuarters } from '@lyvely/dates';
import { IntervalAggregation } from './interval-aggregation.helper';

export class QuarterlyIntervalAggregation extends IntervalAggregation {
  protected override getGroupId(): PipelineStage.Group['$group']['_id'] {
    return {
      year: '$year',
      quarter: '$quarter',
    };
  }

  protected override getMatchFilter(): PipelineStage.Match['$match'] {
    const dateField = this.getDateField();
    const endDate = this.options.endDate || new Date();
    const range = this.options.range ?? 6;
    const startDate = this.options.startDate || subtractQuarters(endDate, range);
    const utcStartDate = new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate(),
      0,
      0,
      0,
    );

    return {
      [dateField]: { $gte: utcStartDate, $lte: endDate },
    };
  }

  protected override getSort(): PipelineStage.Sort['$sort'] {
    return { '_id.year': 1, '_id.quarter': 1 };
  }
}

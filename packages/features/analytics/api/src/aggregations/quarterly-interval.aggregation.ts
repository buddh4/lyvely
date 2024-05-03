import type { PipelineStage } from 'mongoose';
import { getEndOfDayTZDate, getFullDayTZDate, subtractQuarters } from '@lyvely/dates';
import { IntervalAggregation } from './interval.aggregation';

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

    const tzEndDate = getEndOfDayTZDate(endDate, this.options.timezone);

    // We use the given timezone for calculating the start date.
    const tzStartDate = getFullDayTZDate(startDate, this.options.timezone);

    return {
      [dateField]: { $gte: tzStartDate, $lte: tzEndDate },
    };
  }

  protected override getSort(): PipelineStage.Sort['$sort'] {
    return { '_id.year': 1, '_id.quarter': 1 };
  }
}

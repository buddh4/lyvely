import type { PipelineStage } from 'mongoose';
import { getEndOfDayTZDate, getFullDayTZDate, subtractDays } from '@lyvely/dates';
import { IntervalAggregation } from './interval.aggregation';

export class DailyIntervalAggregation extends IntervalAggregation {
  protected override getGroupId(): PipelineStage.Group['$group']['_id'] {
    const $dateField = `$${this.getDateField()}`;
    return {
      year: { $year: $dateField },
      month: { $month: $dateField },
      day: { $dayOfMonth: $dateField },
    };
  }

  protected override getMatchFilter(): PipelineStage.Match['$match'] {
    const dateField = this.getDateField();

    const endDate = this.options.endDate || new Date();
    const range = this.options.range ?? 7;
    const startDate = this.options.startDate || subtractDays(endDate, range);

    // We use the given timezone for calculating the start date.
    const tzStartDate = getFullDayTZDate(startDate, this.options.timezone);

    const tzEndDate = getEndOfDayTZDate(endDate, this.options.timezone);

    return {
      [dateField]: { $gte: tzStartDate, $lte: tzEndDate },
    };
  }

  protected override getSort(): PipelineStage.Sort['$sort'] {
    return { '_id.year': 1, '_id.month': 1, '_id.day': 1 };
  }
}

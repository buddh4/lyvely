import type { PipelineStage } from 'mongoose';
import { subtractDays } from '@lyvely/dates';
import { IntervalAggregation } from './interval-aggregation.helper';

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

    // TODO: Proper timezone handling?
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
    return { '_id.year': 1, '_id.month': 1, '_id.day': 1 };
  }
}

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
    const range = this.options.range ?? 6;
    const startDate = subtractDays(endDate, range);

    if (startDate.getFullYear() === endDate.getFullYear()) {
      return {
        year: endDate.getFullYear(),
        date: { $lte: endDate },
      };
    }

    return {
      $or: [
        { year: { $eq: startDate.getFullYear() }, [dateField]: { $gte: startDate } },
        { year: { $gt: startDate.getFullYear(), $lt: endDate.getFullYear() } },
        { year: { $eq: endDate.getFullYear() }, [dateField]: { $lte: endDate } },
      ],
    };
  }

  protected override getSort(): PipelineStage.Sort['$sort'] {
    const $dateField = `$${this.getDateField()}`;
    return { $year: 1, [$dateField]: 1 };
  }
}

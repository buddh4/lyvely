import type { PipelineStage } from 'mongoose';
import { parseTimingId, subtractWeeks, toWeekTimingId } from '@lyvely/dates';
import { IntervalAggregation } from './interval.aggregation';

export class WeeklyIntervalAggregation extends IntervalAggregation {
  protected override getGroupId(): PipelineStage.Group['$group']['_id'] {
    return {
      year: '$year',
      month: '$week',
    };
  }

  protected override getMatchFilter(): PipelineStage.Match['$match'] {
    const endDate = this.options.endDate || new Date();
    const range = this.options.range ?? 6;
    const startDate = this.options.startDate || subtractWeeks(endDate, range);

    const { week: endWeek } = parseTimingId(
      toWeekTimingId(endDate, this.options.locale, this.options.preferences)
    ) as { week: number };

    if (startDate.getFullYear() === endDate.getFullYear()) {
      return {
        year: endDate.getFullYear(),
        week: { $lte: endWeek },
      };
    }

    const { week: startWeek } = parseTimingId(
      toWeekTimingId(startDate, this.options.locale, this.options.preferences)
    ) as { week: number };

    return {
      $or: [
        { year: { $eq: startDate.getFullYear() }, week: { $gte: startWeek } },
        { year: { $gt: startDate.getFullYear(), $lt: endDate.getFullYear() } },
        { year: { $eq: endDate.getFullYear() }, week: { $lte: endWeek } },
      ],
    };
  }

  protected override getSort(): PipelineStage.Sort['$sort'] {
    return { $year: 1, $week: 1 };
  }
}

import type { PipelineStage } from 'mongoose';
import { subtractMonths } from '@lyvely/dates';
import { IntervalAggregation } from './interval-aggregation.helper';

export class MonthlyIntervalAggregation extends IntervalAggregation {
  protected override getGroupId(): PipelineStage.Group['$group']['_id'] {
    return {
      year: '$year',
      month: '$month',
    };
  }

  protected override getMatchFilter(): PipelineStage.Match['$match'] {
    const endDate = this.options.endDate || new Date();
    const range = this.options.range ?? 6;
    const startDate = subtractMonths(endDate, range);

    if (startDate.getFullYear() === endDate.getFullYear()) {
      return {
        year: endDate.getFullYear(),
        month: { $lte: endDate.getMonth() },
      };
    }

    return {
      $or: [
        { year: { $eq: startDate.getFullYear() }, month: { $gte: startDate.getMonth() } },
        { year: { $gt: startDate.getFullYear(), $lt: endDate.getFullYear() } },
        { year: { $eq: endDate.getFullYear() }, month: { $lte: endDate.getMonth() } },
      ],
    };
  }

  protected override getSort(): PipelineStage.Sort['$sort'] {
    return { $year: 1, $month: 1 };
  }
}

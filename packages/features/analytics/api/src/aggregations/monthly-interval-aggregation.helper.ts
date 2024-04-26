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
    const startDate = this.options.startDate || subtractMonths(endDate, range);

    return {
      $or: [
        { year: { $eq: startDate.getFullYear() }, month: { $gte: startDate.getMonth() + 1 } },
        { year: { $gt: startDate.getFullYear(), $lt: endDate.getFullYear() } },
        { year: { $eq: endDate.getFullYear() }, month: { $lte: endDate.getMonth() + 1 } },
      ],
    };
  }

  protected override getSort(): PipelineStage.Sort['$sort'] {
    return { '_id.year': 1, '_id.month': 1 };
  }
}

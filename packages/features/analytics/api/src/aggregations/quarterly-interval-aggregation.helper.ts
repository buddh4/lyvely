import type { PipelineStage } from 'mongoose';
import { getQuarter, subtractQuarters } from '@lyvely/dates';
import { IntervalAggregation } from './interval-aggregation.helper';

export class QuarterlyIntervalAggregation extends IntervalAggregation {
  protected override getGroupId(): PipelineStage.Group['$group']['_id'] {
    return {
      year: '$year',
      quarter: '$quarter',
    };
  }

  protected override getMatchFilter(): PipelineStage.Match['$match'] {
    const endDate = this.options.endDate || new Date();
    const range = this.options.range ?? 6;
    const startDate = subtractQuarters(endDate, range);

    if (startDate.getFullYear() === endDate.getFullYear()) {
      return {
        year: endDate.getFullYear(),
        quarter: { $lte: getQuarter(endDate) },
      };
    }

    return {
      $or: [
        { year: { $eq: startDate.getFullYear() }, quarter: { $gte: getQuarter(startDate) } },
        { year: { $gt: startDate.getFullYear(), $lt: endDate.getFullYear() } },
        { year: { $eq: endDate.getFullYear() }, quarter: { $lte: getQuarter(endDate) } },
      ],
    };
  }

  protected override getSort(): PipelineStage.Sort['$sort'] {
    return { '_id.year': 1, '_id.quarter': 1 };
  }
}

import type { PipelineStage } from 'mongoose';
import { IntervalAggregation, IntervalAggregationOptions } from './interval-aggregation.helper';

export class YearlyIntervalAggregation extends IntervalAggregation {
  protected override getGroupId(): PipelineStage.Group['$group']['_id'] {
    return '$year';
  }

  protected override getMatchFilter(): PipelineStage.Match['$match'] {
    const year = this.options.endDate?.getFullYear() || new Date().getFullYear();
    const range = this.options.range ?? 6;
    return {
      year: { $in: Array.from({ length: range }, (_, index) => year - index) },
    };
  }

  protected getSort(): PipelineStage.Sort['$sort'] {
    return { $year: 1 };
  }
}

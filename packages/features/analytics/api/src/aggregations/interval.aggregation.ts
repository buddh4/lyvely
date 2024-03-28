import { IntervalAggregationOptions } from './interval-aggregation.helper';
import { CalendarInterval } from '@lyvely/dates';
import { YearlyIntervalAggregation } from './yearly-interval-aggregation.helper';
import { QuarterlyIntervalAggregation } from './quarterly-interval-aggregation.helper';
import { MonthlyIntervalAggregation } from './monthly-interval-aggregation.helper';
import { WeeklyIntervalAggregation } from './weekly-interval-aggregation.helper';
import { DailyIntervalAggregation } from './daily-interval-aggregation.helper';
import { PipelineStage } from 'mongoose';
import type { ChartSeriesKeyValueData } from '@lyvely/analytics-interface';
import { ChartSeriesDataTypes } from '@lyvely/analytics-interface';
import { AbstractDao } from '@lyvely/api';

export type IntervalAggregationResult = Array<{ _id: number | string | object; value: number }>;
export type IntervalAggregationPipeline = [
  PipelineStage.Group,
  PipelineStage.Match,
  PipelineStage.Sort,
];

export async function runIntervalAggregation(
  dao: AbstractDao<any>,
  options: IntervalAggregationOptions,
): Promise<ChartSeriesKeyValueData[]> {
  const pipeline = createIntervalAggregationPipeline(options);
  const aggregationResult = await execAggregate(dao, pipeline);
  return transformToKeyValueData(aggregationResult);
}

export function createIntervalAggregationPipeline(
  options: IntervalAggregationOptions,
): IntervalAggregationPipeline {
  switch (options.interval) {
    case CalendarInterval.Yearly:
      return new YearlyIntervalAggregation(options).build();
    case CalendarInterval.Quarterly:
      return new QuarterlyIntervalAggregation(options).build();
    case CalendarInterval.Monthly:
      return new MonthlyIntervalAggregation(options).build();
    case CalendarInterval.Weekly:
      return new WeeklyIntervalAggregation(options).build();
    default:
      return new DailyIntervalAggregation(options).build();
  }
}

async function execAggregate(
  dao: AbstractDao<any>,
  pipeline: IntervalAggregationPipeline,
): Promise<IntervalAggregationResult> {
  return dao.aggregate(pipeline);
}

function transformToKeyValueData(data: IntervalAggregationResult): ChartSeriesKeyValueData[] {
  return [
    {
      type: ChartSeriesDataTypes.KEYVALUE,
      data: data.map(({ _id, value }) => ({
        key: _id,
        value,
      })),
    },
  ];
}

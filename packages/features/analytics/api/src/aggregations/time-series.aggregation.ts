import { IntervalAggregationOptions } from './interval-aggregation.helper';
import { subtractMonths, subtractYears } from '@lyvely/dates';
import { MonthlyIntervalAggregation } from './monthly-interval-aggregation.helper';
import { DailyIntervalAggregation } from './daily-interval-aggregation.helper';
import { PipelineStage } from 'mongoose';
import type { TimeSeriesChartData, TimeSeriesCategoryKey } from '@lyvely/analytics-interface';
import { ChartSeriesDataTypes } from '@lyvely/analytics-interface';
import { AbstractDao } from '@lyvely/api';

export type TimeSeriesAggregationResult = Array<{ _id: TimeSeriesCategoryKey; value: number }>;
export type TimeSeriesAggregationPipeline = [
  PipelineStage.Match,
  PipelineStage.Group,
  PipelineStage.Sort,
];

export async function runTimeSeriesAggregation(
  dao: AbstractDao<any>,
  options: IntervalAggregationOptions,
): Promise<TimeSeriesChartData[]> {
  const pipeline = createTimeSeriesAggregationPipeline(options);
  const aggregationResult = await execAggregate(dao, pipeline);
  return transformToKeyValueData(aggregationResult, options);
}

/**
 * Creates an aggregation pipeline based on the given options.
 *
 * Note: The ranges needs to be in sync with the `getTimeSeriesIntervalXAxis` helper function.
 *
 * @param {IntervalAggregationOptions} options - The options to configure the interval aggregation pipeline.
 * @return {TimeSeriesAggregationPipeline} - The interval aggregation pipeline based on the given options.
 */
export function createTimeSeriesAggregationPipeline(
  options: IntervalAggregationOptions,
): TimeSeriesAggregationPipeline {
  switch (options.interval) {
    case '7D':
      return new DailyIntervalAggregation({ ...options, range: 6 }).build();
    case '1M':
      return new DailyIntervalAggregation({
        ...options,
        startDate: subtractMonths(options.endDate || new Date(), 1),
      }).build();
    case '6M':
      return new MonthlyIntervalAggregation({ ...options, range: 5 }).build();
    case '1Y':
      return new MonthlyIntervalAggregation({
        ...options,
        startDate: subtractYears(options.endDate || new Date(), 1),
      }).build();
    case '3Y':
      return new MonthlyIntervalAggregation({
        ...options,
        startDate: subtractYears(options.endDate || new Date(), 3),
      }).build();
  }
}

async function execAggregate(
  dao: AbstractDao<any>,
  pipeline: TimeSeriesAggregationPipeline,
): Promise<TimeSeriesAggregationResult> {
  return dao.aggregate(pipeline);
}

function transformToKeyValueData(
  data: TimeSeriesAggregationResult,
  options: IntervalAggregationOptions,
): TimeSeriesChartData[] {
  return [
    {
      type: ChartSeriesDataTypes.KEYVALUE,
      name: options.name,
      data: data.map(({ _id, value }) => ({
        key: _id,
        value,
      })),
    },
  ];
}

import { IntervalAggregationOptions } from './interval.aggregation';
import { subtractMonths, subtractYears } from '@lyvely/dates';
import { MonthlyIntervalAggregation } from './monthly-interval.aggregation';
import { DailyIntervalAggregation } from './daily-interval.aggregation';
import { PipelineStage } from 'mongoose';
import { type TimeSeriesChartData, type TimeSeriesCategoryKey } from '@lyvely/analytics-interface';
import { ChartSeriesDataTypes } from '@lyvely/analytics-interface';
import { AbstractDao, assureStringId, type TObjectId } from '@lyvely/api';
import { omit } from 'lodash';

export type TimeSeriesAggregationResult = Array<{
  _id: TimeSeriesCategoryKey<TObjectId>;
  value: number;
}>;
export type TimeSeriesAggregationPipeline = [
  PipelineStage.Match,
  PipelineStage.Group,
  PipelineStage.Sort,
];

export async function runTimeSeriesAggregation(
  dao: AbstractDao<any>,
  options: IntervalAggregationOptions,
): Promise<TimeSeriesChartData<string>[]> {
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
): TimeSeriesChartData<string>[] {
  if (options.filter?.uids?.length) {
    return groupByUid(data, options);
  }

  return [createTimeSeriesChartData(options.name, options.color, data)];
}

function groupByUid(
  data: TimeSeriesAggregationResult,
  options: IntervalAggregationOptions,
): TimeSeriesChartData<string>[] {
  const result: TimeSeriesChartData<string>[] = [];
  const uidMap = new Map<string, TimeSeriesAggregationResult>();

  options.filter!.uids?.forEach((uid) => {
    uidMap.set(assureStringId(uid), []);
  });

  data.forEach((entry) => {
    const uid = assureStringId(entry._id.uid);
    if (!uidMap.get(uid)) uidMap.set(uid, []);
    uidMap.get(uid)!.push(entry);
  });

  uidMap.forEach((uidData, uid) => result.push(createTimeSeriesChartData(uid, undefined, uidData)));
  return result;
}

function createTimeSeriesChartData(
  name: string,
  color: string | undefined,
  data: TimeSeriesAggregationResult,
): TimeSeriesChartData<string> {
  return {
    type: ChartSeriesDataTypes.KEYVALUE,
    color,
    name,
    data: transformAggregationData(data),
  };
}

function transformAggregationData(
  data: TimeSeriesAggregationResult,
): TimeSeriesChartData<string>['data'] {
  return data.map(({ _id, value }) => ({
    key: _id.uid ? { ..._id, uid: _id.uid.toString() } : omit(_id, 'uid'),
    value,
  }));
}

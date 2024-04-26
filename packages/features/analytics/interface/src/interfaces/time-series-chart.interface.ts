import {
  type ChartSeriesKeyValueData,
  type IChartConfig,
  IChartSeriesConfig,
} from './chart.interface';
import { ChartSeriesDataResponse } from '../models';

export interface TimeSeriesCategoryKey {
  year: number;
  month?: number;
  day?: number;
}

export type TimeSeriesAggregationInterval = '7D' | '1M' | '6M' | '1Y' | '3Y';

export const timeSeriesIntervalFilters: TimeSeriesAggregationInterval[] = [
  '7D',
  '1M',
  '6M',
  '1Y',
  '3Y',
] as const;

export interface ITimeSeriesChartSeriesConfig extends IChartSeriesConfig {
  chartType?: string;
}

export interface ITimeSeriesChartConfig extends IChartConfig<ITimeSeriesChartSeriesConfig> {}

export type TimeSeriesChartData = ChartSeriesKeyValueData<TimeSeriesCategoryKey, number>;

export type TimeSeriesChartDataResponse = ChartSeriesDataResponse<TimeSeriesChartData>;

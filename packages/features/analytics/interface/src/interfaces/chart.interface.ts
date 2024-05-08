import { Type } from '@lyvely/common';
import { ChartSeriesConfigModel } from '../models';
import type { IContent } from '@lyvely/interface';

export enum TimeSeriesChartType {
  Line = 'line',
  Bar = 'bar',
}

export enum ChartState {
  InProgress = 'in-progress',
  Error = 'error',
  Ready = 'ready',
}

export enum ChartAccumulation {
  Sum = 'sum',
  Avg = 'avg',
  // Median = 'median',
}

export interface IChartStatus {
  state: ChartState;
  errors?: string[];
}

export interface IChart<TID = any, TConfig extends IChartConfig = IChartConfig>
  extends IContent<TID, TConfig, IChartStatus> {
  type: string;
  config: TConfig;
  state: IChartStatus;
}

export interface IChartSeriesConfig {
  id: string;
  name: string;
  type: string;
}

export interface IChartConfig<TSeriesConfig extends IChartSeriesConfig = IChartSeriesConfig> {
  category: string;
  series: TSeriesConfig[];
}

/**
 * The interface representing a chart category definition used to register new categories of charts.
 */
export interface IChartCategoryDefinition {
  readonly id: string;
}

/**
 * The interface representing a chart series definition used to register new types of chart series.
 * A chart series may represent a very specific series or a more generic chart series, which can be configured
 * by a config model.
 * @interface IChartSeriesDefinition
 */
export interface IChartSeriesDefinition<
  TConfigType extends ChartSeriesConfigModel = ChartSeriesConfigModel,
> {
  /** A unique id for this chart series type. **/
  readonly id: string;

  /**
   * An optional config class type representing a model holding configuration options usually provided by the frontend
   * and mainly used for validation purposes. This property is not required unless the chart series does provide
   * additional configuration options.
   * */
  readonly configType?: Type<TConfigType>;

  /**
   * Defines the category types with which this series is compatible.
   */
  readonly categoryTypes: string[];
}

export enum ChartSeriesDataTypes {
  ERROR = 'Error',
  KEYVALUE = 'KeyValue',
  ARRAY = 'Array',
}

/**
 * Represents different types of data used for a chart series.
 *
 * @template T - The type of the chart series. Must extend ChartSeriesDataTypes.
 * @template TData - The type of the data for the chart series.
 */
export type ChartSeriesData<T extends ChartSeriesDataTypes = any, TData = any> = {
  type: T;
  name: string;
  color?: string;
  chartType?: string;
  data: TData;
};

/**
 * Represents a key value data array.
 *
 * @template TValue The type of the series values (default: number)
 */
export type ChartSeriesKeyValueData<
  TKey extends number | string | object = number | string | object,
  TValue = number,
> = ChartSeriesData<ChartSeriesDataTypes.KEYVALUE, Array<{ key: TKey; value: TValue }>>;

/**
 * This data type is used in case an error occurred when generating the chart data.
 */
export type ChartErrorData = ChartSeriesData<ChartSeriesDataTypes.ERROR, string>;

/**
 * Represents a key value data array.
 *
 * @template TValue The type of the series values (default: number)
 */
export type ChartSeriesKeyArrayData<TValue> = ChartSeriesData<
  ChartSeriesDataTypes.ARRAY,
  Array<TValue>
>;

/**
 * Represents the types of accumulation for a chart series.
 *
 * @enum {string}
 */
export enum ChartSeriesAccumulation {
  Sum = 'sum',
  Avg = 'avg',
  // Median = 'median',
}

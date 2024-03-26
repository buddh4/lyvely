import { Type } from '@lyvely/common';
import { ChartSeriesConfigModel } from '../models';

export enum ChartCategory {
  Graph = 'graph',
  Calendar = 'calendar',
  Pie = 'pie',
}

export enum ChartType {
  Line = 'line',
  Bar = 'bar',
  Calendar = 'calendar',
  Pie = 'pie',
}

export const GRAPH_CHART_TYPES = [ChartType.Line, ChartType.Bar];

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

export interface IChart<TConfig extends IChartConfig = IChartConfig> {
  type: string;
  config: TConfig;
  state: IChartStatus;
}

export interface IChartSeriesConfig {
  id: string;
  name: string;
  type: string;
  chartType: ChartType;
}

export interface IChartConfig {
  category: ChartCategory;
  series: IChartSeriesConfig[];
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
  id: string;

  /**
   * An optional config class type representing a model holding configuration options usually provided by the frontend
   * and mainly used for validation purposes. This property is not required unless the chart series does provide
   * additional configuration options.
   * */
  configType?: Type<TConfigType>;

  /**
   * Defines the chart types with which this series is compatible.
   */
  chartTypes: ChartType[];
}

export enum ChartSeriesDataTypes {
  KEYVALUE = 'KeyValue',
  ARRAY = 'Array',
}

/**
 * Represents different types of data used for a chart series.
 *
 * @template T - The type of the chart series. Must extend ChartSeriesDataTypes.
 * @template TData - The type of the data for the chart series.
 */
export type ChartSeriesData<T extends ChartSeriesDataTypes, TData = any> = {
  type: T;
  data: TData;
};

/**
 * Represents a key value data array.
 *
 * @template TValue The type of the series values (default: number)
 */
export type ChartSeriesKeyValueData<TValue = number> = ChartSeriesData<
  ChartSeriesDataTypes.KEYVALUE,
  Array<{ key: string; value: TValue }>
>;

/**
 * Represents a key value data array.
 *
 * @template TValue The type of the series values (default: number)
 */
export type ChartSeriesKeyArrayData<TValue = number> = ChartSeriesData<
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

export enum ChartType {
  Graph = 'graph',
  Calendar = 'calendar',
  Pie = 'pie',
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

export interface IChart {
  type: string;
  status: IChartStatus;
}

export interface IChartConfig {
  type: ChartType;
}

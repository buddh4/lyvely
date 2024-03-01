import { Type } from '@lyvely/common';

export enum GraphChartType {
  Bar = 'bar',
  Line = 'line',
}

export interface IGraphType {
  value: string;
  model?: Type;
}

export interface GraphTypeResponse {
  options: IGraphType[];
}

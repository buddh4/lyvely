import { IDataPoint } from './data-point.interface';
import { ITimeSeriesContent } from './time-series-content.interface';

export interface IUpdateDataPoint<TValue = any> {
  date: string;
  value: TValue;
}

export interface IUpdateDataPointResponse {
  dataPoint: IDataPoint;
  model: ITimeSeriesContent;
}

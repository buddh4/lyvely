import { IDataPoint } from './data-point.interface';
import { BaseModel } from '@lyvely/models';
import { ITimeSeriesContent } from './time-series-content.interface';

export interface IUpdateDataPoint<TValue = any> {
  date: string;
  value: TValue;
}

export interface IUpdateDataPointResponse<T = { dataPoint: IDataPoint }> extends BaseModel<T> {
  dataPoint: IDataPoint;
  model: ITimeSeriesContent;
}

import { IDataPoint } from './data-point.interface';
import { BaseModel } from '@/models';

export interface IUpdateDataPoint<TValue = any> {
  date: string;
  value: TValue;
}

export interface IUpdateDataPointResponse<T = { dataPoint: IDataPoint }> extends BaseModel<T> {
  dataPoint: IDataPoint;
}

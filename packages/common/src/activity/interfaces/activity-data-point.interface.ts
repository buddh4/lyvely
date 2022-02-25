import { ITimeSeriesNumberDataPoint } from '../../time-series';
import { IActivity } from './activity.interface';

export interface IActivityDataPoint<C = IActivity> extends ITimeSeriesNumberDataPoint {
  score: number;
  value: number;
}
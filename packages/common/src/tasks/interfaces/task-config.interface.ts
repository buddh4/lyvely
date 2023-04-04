import { INumberDataPointConfig } from '@/time-series';

export interface ITaskConfig {
  score: number;
  timeSeries: INumberDataPointConfig;
}

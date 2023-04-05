import { INumberDataPointConfig, ITimerDataPointConfig } from '@/time-series';

export interface IHabitConfig {
  score: number;
  timeSeries: INumberDataPointConfig | ITimerDataPointConfig;
}

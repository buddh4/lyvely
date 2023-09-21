import { INumberDataPointConfig, ITimerDataPointConfig } from '@lyvely/time-series';

export interface IHabitConfig {
  score: number;
  timeSeries: INumberDataPointConfig | ITimerDataPointConfig;
}

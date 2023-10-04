import { INumberDataPointConfig, ITimerDataPointConfig } from '@lyvely/time-series-interface';

export interface IHabitConfig {
  score: number;
  timeSeries: INumberDataPointConfig | ITimerDataPointConfig;
}

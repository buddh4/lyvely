import { TimerDataPoint, TimeSeriesContent } from '@/time-series';
import { TimerDataPointConfig } from '@/time-series/schemas';

export type TimerDataPointContent<TConfig extends TimerDataPointConfig = TimerDataPointConfig> =
  TimeSeriesContent<any, TConfig>;

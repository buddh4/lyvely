import { IDataPointConfig } from './data-point.interface';
import { IContent } from '@/content';
import { CalendarInterval } from '@/calendar';

export interface ITimeSeriesContentConfig<TDataPointConfig = IDataPointConfig> {
  timeSeries: TDataPointConfig;
}

export interface ITimeSeriesContent<TDataPointConfig = IDataPointConfig> extends IContent {
  config: ITimeSeriesContentConfig<TDataPointConfig>;
  get interval(): CalendarInterval;
}

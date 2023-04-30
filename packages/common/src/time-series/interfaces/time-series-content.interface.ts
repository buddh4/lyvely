import { IDataPointConfig } from './data-point.interface';
import { IContent } from '@/content';
import { CalendarInterval } from '@/calendar';

export interface ITimeSeriesContentConfig<TDataPointConfig = IDataPointConfig> {
  timeSeries: TDataPointConfig;
}

export interface ITimeSeriesSummaryWindowEntry {
  tid: string;
  value: number;
}

export interface ITimeSeriesSummary {
  window: ITimeSeriesSummaryWindowEntry[];
}

export interface ITimeSeriesContent<TDataPointConfig = IDataPointConfig> extends IContent {
  config: ITimeSeriesContentConfig<TDataPointConfig>;
  timeSeriesSummary: ITimeSeriesSummary;
  get interval(): CalendarInterval;
  set interval(interval: CalendarInterval);
}

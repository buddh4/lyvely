import { IDataPointConfig } from './data-point.interface';
import { IContent } from '@lyvely/content';
import { CalendarInterval } from '@lyvely/calendar';

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

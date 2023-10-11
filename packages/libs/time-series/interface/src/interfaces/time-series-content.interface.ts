import { IDataPointConfig } from './data-point.interface';
import { IContent } from '@lyvely/core-interface';
import { CalendarInterval } from '@lyvely/dates';

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

export interface ITimeSeriesContent<TID = string, TDataPointConfig = IDataPointConfig>
  extends IContent<TID, ITimeSeriesContentConfig<TDataPointConfig>> {
  timeSeriesSummary: ITimeSeriesSummary;
  get interval(): CalendarInterval;
  set interval(interval: CalendarInterval);
}

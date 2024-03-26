import { IDataPointConfig } from './data-point.interface';
import { IContent } from '@lyvely/interface';
import { CalendarInterval } from '@lyvely/dates';
import type { IContentDataType } from '@lyvely/interface';

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

export interface ITimeSeriesContent<
  TID = string,
  TDataPointConfig = IDataPointConfig,
  TState extends Object | undefined = any,
  TData extends IContentDataType = IContentDataType,
> extends IContent<TID, ITimeSeriesContentConfig<TDataPointConfig>, TState, TData> {
  timeSeriesSummary: ITimeSeriesSummary;
  get interval(): CalendarInterval;
  set interval(interval: CalendarInterval);
}

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

export interface ITimeSeriesSummary<TID = string> {
  uid: TID | null;
  window: ITimeSeriesSummaryWindowEntry[];
}

export interface ITimeSeriesState<TID = string> {
  summaries: ITimeSeriesSummary<TID>[];
}

export interface ITimeSeriesContent<
  TID = string,
  TConfig extends ITimeSeriesContentConfig = ITimeSeriesContentConfig,
  TState extends ITimeSeriesState<TID> = ITimeSeriesState<TID>,
  TData extends IContentDataType = IContentDataType,
> extends IContent<TID, TConfig, TState, TData> {
  get interval(): CalendarInterval;
  set interval(interval: CalendarInterval);
}

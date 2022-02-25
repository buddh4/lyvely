import { ITimeSeriesContent, ITimeSeriesDataPoint } from '../time-series';

export interface IJournal extends ITimeSeriesContent {
  title: string;
}

export interface IJournalLog extends ITimeSeriesDataPoint {
  value: number;
  text: string;
}
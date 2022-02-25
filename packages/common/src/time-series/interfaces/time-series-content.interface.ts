import { IContent } from '../../content';
import { Sortable } from '../../model';
import { CalendarIntervalEnum } from '../../calendar';
import { DataPointInputType, DataPointValueType } from './time-series-data-point.interface';

export interface ITimeSeriesContent extends IContent, Sortable {
  interval: CalendarIntervalEnum;
  dataPointConfig: ITimeSeriesDataPointConfig;
  dataPointConfigHistory?: ITimeSeriesDataPointConfigRevision[]
  userStrategy: TimeSeriesUserStrategy;
  sortOrder: number;
}

export enum TimeSeriesUserStrategy {
  Shared,
  PerUser
}

export interface ITimeSeriesDataPointConfig {
  strategy: string;
  valueType: DataPointValueType;
  inputType?: DataPointInputType;
}

export interface ITimeSeriesDataPointConfigRevision {
  updatedAt: Date,
  config: ITimeSeriesDataPointConfig;
}
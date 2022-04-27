import { IContent } from '../../content';
import { Sortable } from '../../model';
import { CalendarIntervalEnum } from '../../calendar';
import { DataPointInputType, DataPointValueType } from './data-point.interface';
import { UserAssignmentStrategy } from "../../user";

export interface ITimeSeriesContent extends IContent, Sortable {
  interval: CalendarIntervalEnum;
  dataPointConfig: ITimeSeriesDataPointConfig;
  dataPointConfigHistory?: ITimeSeriesDataPointConfigRevision[]
  userStrategy: UserAssignmentStrategy;
  sortOrder: number;
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

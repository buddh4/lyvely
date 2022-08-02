import { IContent } from '../../content';
import { Sortable } from '../../model';
import { CalendarIntervalEnum } from '../../calendar';
import { DataPointInputType, DataPointValueType } from './data-point.interface';
import { UserAssignmentStrategy } from "../../user";

export interface ITimeSeriesContent<E extends IDataPointConfig = IDataPointConfig> extends IContent, Sortable {
  interval: CalendarIntervalEnum;
  dataPointConfig: E;
  dataPointConfigHistory?: IDataPointConfigRevision[]
  userStrategy: UserAssignmentStrategy;
  sortOrder: number;
}

export interface IDataPoint<TID> {
  id: string,
  pid: TID,
  cid: TID,
  uid?: TID,
  interval: CalendarIntervalEnum,
  tid: string,
  date: Date,
}


export interface IDataPointConfig {
  strategy: string;
  valueType: DataPointValueType;
  inputType?: DataPointInputType;
}

export interface INumberDataPointConfig extends IDataPointConfig {
  valueType: DataPointValueType.Number,
  min?: number;
  max?: number;
  optimal?: number;
}

export interface IDataPointConfigRevision {
  updatedAt: Date,
  config: IDataPointConfig;
}

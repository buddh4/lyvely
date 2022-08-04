import { IContent } from '../../content';
import { Sortable } from '../../model';
import { CalendarIntervalEnum } from '../../calendar';
import { DataPointInputType, DataPointValueType } from './data-point.interface';
import { UserAssignmentStrategy } from "../../user";

export interface ITimeSeriesContent<E extends IDataPointConfig = IDataPointConfig> extends IContent, Sortable {
  dataPointConfig: E;
  dataPointConfigHistory?: IDataPointConfigRevision[]
  userStrategy: UserAssignmentStrategy;
  sortOrder: number;
}

export type INumberTimeSeriesContent = ITimeSeriesContent<INumberDataPointConfig>;

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
  interval: CalendarIntervalEnum,
  strategy: string;
  history: IDataPointConfigRevision[];
  valueType: DataPointValueType;
  inputType?: DataPointInputType;
}

export interface IDataPointConfigRevision {
  validUntil: Date;
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

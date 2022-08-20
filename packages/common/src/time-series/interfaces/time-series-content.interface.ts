import { IContent } from '../../content';
import { Sortable } from '../../model';
import { CalendarIntervalEnum } from '../../calendar';
import { DataPointInputType, DataPointValueType } from './data-point.interface';
import { UserAssignmentStrategy } from "../../user";

export interface ITimeSeriesContent<E extends IDataPointConfig = IDataPointConfig, TID = any> extends IContent<TID>, Sortable {
  dataPointConfig: E;
  dataPointConfigHistory?: IDataPointConfigRevision[]
  userStrategy: UserAssignmentStrategy;
  sortOrder: number;
}

export type INumberTimeSeriesContent<TID = TObjectId> = ITimeSeriesContent<INumberDataPointConfig, TID>;

export interface IDataPoint {
  id: string,
  pid: TObjectId,
  cid: TObjectId,
  uid?: TObjectId,
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

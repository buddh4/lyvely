import { CalendarIntervalEnum } from '../../calendar';
import { DataPointInputType, DataPointValueType } from "../models";

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

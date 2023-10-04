import {
  DataPointValueType,
  IDataPointConfig,
  IDataPointConfigRevision,
  IDataPointSettings,
} from './data-point.interface';

interface ITimerSettings {
  min?: number;
  max?: number;
  optimal?: number;
}

export interface ITimerDataPointConfigRevision extends IDataPointConfigRevision, ITimerSettings {}

export interface ITimerDataPointConfig extends IDataPointConfig, ITimerSettings {
  valueType: typeof DataPointValueType.Timer;
  history: ITimerDataPointConfigRevision[];
}

export interface ITimerDataPointSettings extends IDataPointSettings, ITimerSettings {}

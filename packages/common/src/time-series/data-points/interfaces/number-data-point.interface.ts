import {
  DataPointValueType,
  IDataPointConfig,
  IDataPointConfigRevision,
  IDataPointSettings,
} from './data-point.interface';

export enum DataPointNumberInputType {
  Checkbox = 'checkbox',
  Range = 'range',
  Spinner = 'spinner',
  Time = 'time',
}

export interface INumberDataPointConfigRevision extends IDataPointConfigRevision {
  min?: number;
  max?: number;
  optimal?: number;
}

export interface INumberDataPointConfig extends IDataPointConfig {
  valueType: DataPointValueType.Number;
  history: INumberDataPointConfigRevision[];
  min?: number;
  max?: number;
  optimal?: number;
}

export interface INumberDataPointSettings extends IDataPointSettings {
  min?: number;
  max?: number;
  optimal?: number;
}

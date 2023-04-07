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
}

interface INumberSettings {
  min?: number;
  max?: number;
  optimal?: number;
}

export interface INumberDataPointConfigRevision extends IDataPointConfigRevision, INumberSettings {}

export interface INumberDataPointConfig extends IDataPointConfig, INumberSettings {
  valueType: typeof DataPointValueType.Number;
  history: INumberDataPointConfigRevision[];
}

export interface INumberDataPointSettings extends IDataPointSettings, INumberSettings {}

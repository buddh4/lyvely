import { CalendarIntervalEnum } from '@/calendar';

export enum DataPointNumberInputStrategy {
  CheckboxNumber = 'checkbox_number',
  RangeNumber = 'range_number',
  SpinnerNumber = 'spinner_number'
}

export enum DataPointInputStrategy {
  CheckboxNumber = 'checkbox_number',
  RangeNumber = 'range_number',
  SpinnerNumber = 'spinner_number',
  TextareaText = 'TextareaText',
}

export enum DataPointNumberInputType {
  Checkbox = 'checkbox',
  Range = 'range',
  Spinner = 'spinner',
}

export enum DataPointValueType {
  Number = 'number',
  Boolean = 'boolean',
  Text = 'text',
  //File = 'file',
  //Time = 'time',
}

export enum DataPointInputType {
  Checkbox = 'checkbox',
  Range = 'range',
  Spinner = 'spinner',
  Textarea = 'textarea',
  Provider = 'provider'
  //Richtext = 'richtext'
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

export interface INumberDataPointSettings {
  min?: number;
  max?: number;
  optimal?: number;
  interval: CalendarIntervalEnum;
}

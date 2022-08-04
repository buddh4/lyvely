import { CalendarIntervalEnum } from "../../calendar";

export interface ITimeSeriesDataPoint {
  cid: string,
  uid?: string,
  interval: CalendarIntervalEnum,
  date: Date,
  tid: string,
}

export interface ITimeSeriesNumberDataPoint extends ITimeSeriesDataPoint {
  value: number;
}

export interface ITimeSeriesTextDataPoint extends ITimeSeriesDataPoint {
  value: string;
}

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

export enum DataPointInputType {
  Checkbox = 'checkbox',
  Range = 'range',
  Spinner = 'spinner',
  Textarea = 'textarea',
  Provider = 'provider'
  //Richtext = 'richtext'
}

export enum DataPointValueType {
  Number = 'number',
  Boolean = 'boolean',
  Text = 'text',
  //File = 'file',
  //Time = 'time',
}

// CheckboxValueStrategy extends NumberValueStrategy
// RangeValueStrategy extends NumberValueStrategy

export interface NumberDataPointSettings {
  min?: number;
  max?: number;
  optimal?: number;
  interval: CalendarIntervalEnum;
}

export const SupporedLogValueInputTypes = {
  [DataPointValueType.Number]: [DataPointInputType.Checkbox, DataPointInputType.Range, DataPointInputType.Spinner],
  [DataPointValueType.Text]: [DataPointInputType.Textarea],
  [DataPointValueType.Boolean]: [DataPointInputType.Checkbox],
}

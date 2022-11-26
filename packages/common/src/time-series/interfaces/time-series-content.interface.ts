import { CalendarIntervalEnum } from '@/calendar';
import { UserAssignmentStrategy } from '@/collab';

export enum DataPointValueType {
  Number = 'number',
  Boolean = 'boolean',
  Text = 'text',
  //File = 'file',
  //Time = 'time',
}

export enum DataPointNumberInputType {
  Checkbox = 'checkbox',
  Range = 'range',
  Spinner = 'spinner',
  Time = 'time',
}

export enum DataPointInputType {
  Checkbox = 'checkbox',
  Range = 'range',
  Spinner = 'spinner',
  Time = 'time',
  Textarea = 'textarea',
  //Provider = 'provider',
  //Richtext = 'richtext'
}

export interface IDataPointConfig {
  interval: CalendarIntervalEnum;
  history: IDataPointConfigRevision[];
  valueType: DataPointValueType;
  inputType?: DataPointInputType;
  userStrategy: UserAssignmentStrategy;
}

export interface IDataPointConfigRevision {
  validUntil: Date;
  valueType: DataPointValueType;
  inputType?: DataPointInputType;
  interval: CalendarIntervalEnum;
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

export interface INumberDataPointSettings {
  min?: number;
  max?: number;
  optimal?: number;
  interval: CalendarIntervalEnum;
  userStrategy?: UserAssignmentStrategy;
  inputType?: DataPointInputType;
}

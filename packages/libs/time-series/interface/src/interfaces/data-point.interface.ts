import { CalendarInterval } from '@lyvely/dates';
import { UserAssignmentStrategy } from '@lyvely/common';

export const DataPointValueType = {
  Number: 'number',
  Selection: 'selection',
  Timer: 'timer',
  Text: 'text',
  //File = 'file',
  //Time = 'time',
} as const;

export enum DataPointInputType {
  Checkbox = 'checkbox',
  Range = 'range',
  Spinner = 'spinner',
  Timer = 'timer',
  Textarea = 'textarea',
  Radio = 'radio',
  Dropdown = 'dropdown',
  //Provider = 'provider',
  //Richtext = 'richtext'
}

export interface IDataPoint<TValue = any> {
  id: string;
  cid: any;
  uid?: any;
  date: Date;
  interval: CalendarInterval;
  tid: string;
  valueType: string;
  value: TValue;
}

export interface IDataPointConfig {
  interval: CalendarInterval;
  history: IDataPointConfigRevision[];
  valueType: string;
  inputType?: DataPointInputType;
  userStrategy: UserAssignmentStrategy;
}

export interface IDataPointConfigRevision {
  validUntil: Date;
  valueType: string;
  inputType?: DataPointInputType;
  interval: CalendarInterval;
}

export interface IDataPointSettings {
  userStrategy?: UserAssignmentStrategy;
  inputType?: DataPointInputType;
  interval: CalendarInterval;
}

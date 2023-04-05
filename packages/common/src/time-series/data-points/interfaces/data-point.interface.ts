import { CalendarIntervalEnum } from '@/calendar';
import { UserAssignmentStrategy } from '@/collab';

export enum DataPointValueType {
  Number = 'number',
  Selection = 'selection',
  Timer = 'timer',
  Text = 'text',
  //File = 'file',
  //Time = 'time',
}

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
  cid: TObjectId;
  uid?: TObjectId;
  date: Date;
  interval: CalendarIntervalEnum;
  tid: string;
  valueType: string;
  value: TValue;
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

export interface IDataPointSettings {
  userStrategy?: UserAssignmentStrategy;
  inputType?: DataPointInputType;
  interval: CalendarIntervalEnum;
}

import { CalendarIntervalEnum } from '@/calendar';
import { UserAssignmentStrategy } from '@/collab';
import { Expose } from 'class-transformer';
import { TransformObjectId } from '@/utils';

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
  Time = 'time',
  Textarea = 'textarea',
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

import {
  DataPointValueType,
  IDataPointConfig,
  IDataPointConfigRevision,
  IDataPointSettings,
} from './data-point.interface';

export enum DataPointTextInputType {
  Textarea = 'textarea',
}

export interface ITextDataPointConfig extends IDataPointConfig {
  valueType: DataPointValueType.Text;
  history: ITextDataPointConfigRevision[];
  required?: boolean;
}

export interface ITextDataPointConfigRevision extends IDataPointConfigRevision {
  required?: boolean;
}

export interface ITextDataPointSettings extends IDataPointSettings {
  required?: boolean;
}

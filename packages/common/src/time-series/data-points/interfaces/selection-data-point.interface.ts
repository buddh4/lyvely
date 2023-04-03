import {
  DataPointValueType,
  IDataPointConfig,
  IDataPointConfigRevision,
  IDataPointSettings,
} from './data-point.interface';

export enum DataPointSelectionInputType {
  Checkbox = 'checkbox',
  Radio = 'radio',
  Dropdown = 'dropdown',
}

export interface ISelectionDataPointSettings extends IDataPointSettings {
  showOther?: boolean;
  options: Array<string>;
}

export interface ISelectionDataPointConfigRevision extends IDataPointConfigRevision {
  showOther: boolean;
  options: Array<string>;
}

export interface ISelectionDataPointConfig extends IDataPointConfig {
  valueType: DataPointValueType.Selection;
  history: ISelectionDataPointConfigRevision[];
  showOther: boolean;
  options: Array<string>;
}

export interface ISelectionDataPointValue {
  selection: Array<string>;
  otherValue?: string;
}

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
  allowOther?: boolean;
  options: Array<string>;
}

export interface ISelectionDataPointConfigRevision extends IDataPointConfigRevision {
  allowOther: boolean;
  options: Array<string>;
}

export interface ISelectionDataPointConfig extends IDataPointConfig {
  valueType: typeof DataPointValueType.Selection;
  history: ISelectionDataPointConfigRevision[];
  allowOther: boolean;
  options: Array<string>;
}

export interface ISelectionDataPointValue {
  selection: Array<string>;
  otherValue?: string;
}

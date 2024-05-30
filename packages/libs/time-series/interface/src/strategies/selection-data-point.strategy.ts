import {
  DataPointInputType,
  DataPointValueType,
  ISelectionDataPointConfig,
  ISelectionDataPointConfigRevision,
  ISelectionDataPointValue,
} from '../interfaces';
import { useDataPointStrategyFacade } from '../components';
import { PropertiesOf } from '@lyvely/common';
import { isArray, isObject, validate } from 'class-validator';
import { DataPointStrategy } from './data-point.strategy';
import { SelectionDataPointModel, SelectionDataPointValueModel } from '../models';

export const SELECTION_OTHER_OPTION_KEY = '__other_option__';

const SINGLE_VALUE_INPUT_TYPE = [DataPointInputType.Dropdown, DataPointInputType.Radio];

const DEFAULT_INPUT_TYPE = DataPointInputType.Checkbox;

export class SelectionDataPointStrategy extends DataPointStrategy<
  SelectionDataPointModel,
  ISelectionDataPointConfig,
  ISelectionDataPointConfigRevision,
  ISelectionDataPointValue
> {
  createDataPoint(raw: PropertiesOf<SelectionDataPointModel>): SelectionDataPointModel {
    return new SelectionDataPointModel(raw);
  }

  async validateValue(config: ISelectionDataPointConfig, value: ISelectionDataPointValue) {
    if (!isObject(value) || !isArray(value.selection)) return false;

    const { selection, otherValue } = value;

    const errors = await validate(new SelectionDataPointValueModel(value));
    if (errors.length) return false;

    if (
      selection.length > 1 &&
      this.isSingleValueInputType(config.inputType || DEFAULT_INPUT_TYPE)
    ) {
      return false;
    }

    for (const selectedOption of selection) {
      if (
        (selectedOption === SELECTION_OTHER_OPTION_KEY && !this.allowOtherValue(config)) ||
        (selectedOption === SELECTION_OTHER_OPTION_KEY && !otherValue?.trim().length) ||
        (selectedOption !== SELECTION_OTHER_OPTION_KEY && !config.options.includes(selectedOption))
      ) {
        return false;
      }
    }

    return true;
  }

  private isSingleValueInputType(type: DataPointInputType) {
    return SINGLE_VALUE_INPUT_TYPE.includes(type);
  }

  private allowOtherValue(config: ISelectionDataPointConfig) {
    return config.allowOther && config.inputType !== DataPointInputType.Dropdown;
  }

  prepareValue(config: ISelectionDataPointConfig, value: ISelectionDataPointValue) {
    if (!isObject(value) || !isArray(value.selection)) return value;

    value.selection = value.selection?.filter(
      (key) =>
        config.options.includes(key) ||
        (config.inputType !== DataPointInputType.Dropdown &&
          this.allowOtherValue(config) &&
          key === SELECTION_OTHER_OPTION_KEY)
    );

    if (
      value.selection?.length > 1 &&
      [DataPointInputType.Dropdown, DataPointInputType.Radio].includes(
        config.inputType || DEFAULT_INPUT_TYPE
      )
    ) {
      value.selection = [value.selection[0]];
    }

    return value;
  }

  prepareConfig(config: ISelectionDataPointConfig) {
    if (config.inputType === DataPointInputType.Dropdown) {
      config.allowOther = false;
    }
  }

  getSettingKeys(): Array<keyof ISelectionDataPointConfig> {
    return ['allowOther', 'options'];
  }
}

useDataPointStrategyFacade().registerType(
  DataPointValueType.Selection,
  new SelectionDataPointStrategy()
);

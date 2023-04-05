import {
  DataPointInputType,
  DataPointValueType,
  ISelectionDataPointConfig,
  ISelectionDataPointConfigRevision,
  ISelectionDataPointValue,
} from '../interfaces';
import { useDataPointStrategyFacade } from '../components';
import { PropertiesOf } from '@/utils';
import { isArray, isDefined, isObject, isString } from 'class-validator';
import { DataPointStrategy } from './data-point.strategy';
import { SelectionDataPointModel } from '@/time-series/data-points/models/selection-data-point.model';

export const SELECTION_OTHER_OPTION_KEY = '__other_option__';

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
    return isObject(value) && isArray(value);
  }

  private validateSelection(
    config: ISelectionDataPointConfig,
    value: ISelectionDataPointValue,
  ): boolean {
    const { selection, otherValue } = value;
    if (!isArray(selection)) return false;

    if (
      selection.length > 1 &&
      [DataPointInputType.Dropdown, DataPointInputType.Radio].includes(config.inputType)
    ) {
      return false;
    }

    for (const option of selection) {
      if (
        (option === SELECTION_OTHER_OPTION_KEY && !this.allowOtherValue(config)) ||
        (option === SELECTION_OTHER_OPTION_KEY &&
          (!isString(otherValue) || !otherValue.trim().length)) ||
        (option !== SELECTION_OTHER_OPTION_KEY && config.options.includes(option))
      ) {
        return false;
      }
    }

    return true;
  }

  private allowOtherValue(config: ISelectionDataPointConfig) {
    return config.showOther && config.inputType !== DataPointInputType.Dropdown;
  }

  prepareValue(config: ISelectionDataPointConfig, value: ISelectionDataPointValue) {
    if (!isObject(value) || !isArray(value.selection)) return value;

    value.selection = value.selection?.filter(
      (key) =>
        isDefined(config.options.includes(key)) ||
        (config.inputType !== DataPointInputType.Dropdown &&
          this.allowOtherValue(config) &&
          key === SELECTION_OTHER_OPTION_KEY),
    );

    if (
      value.selection?.length > 1 &&
      [DataPointInputType.Dropdown, DataPointInputType.Radio].includes(config.inputType)
    ) {
      value.selection = [value.selection[0]];
    }

    return value;
  }

  prepareConfig() {
    /** Nothing todo **/
  }

  getSettingKeys(): Array<keyof ISelectionDataPointConfig> {
    return ['showOther', 'options'];
  }
}

useDataPointStrategyFacade().registerType(
  DataPointValueType.Selection,
  new SelectionDataPointStrategy(),
);

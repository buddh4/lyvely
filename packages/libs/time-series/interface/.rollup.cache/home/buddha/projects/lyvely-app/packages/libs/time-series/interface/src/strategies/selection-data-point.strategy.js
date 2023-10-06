import { DataPointInputType, DataPointValueType, } from '../interfaces';
import { useDataPointStrategyFacade } from '../components';
import { isArray, isObject, validate } from 'class-validator';
import { DataPointStrategy } from './data-point.strategy';
import { SelectionDataPointModel, SelectionDataPointValueModel } from '../models';
export const SELECTION_OTHER_OPTION_KEY = '__other_option__';
const SINGLE_VALUE_INPUT_TYPE = [DataPointInputType.Dropdown, DataPointInputType.Radio];
const DEFAULT_INPUT_TYPE = DataPointInputType.Checkbox;
export class SelectionDataPointStrategy extends DataPointStrategy {
    createDataPoint(raw) {
        return new SelectionDataPointModel(raw);
    }
    async validateValue(config, value) {
        if (!isObject(value) || !isArray(value.selection))
            return false;
        const { selection, otherValue } = value;
        const errors = await validate(new SelectionDataPointValueModel(value));
        if (errors.length)
            return false;
        if (selection.length > 1 &&
            this.isSingleValueInputType(config.inputType || DEFAULT_INPUT_TYPE)) {
            return false;
        }
        for (const selectedOption of selection) {
            if ((selectedOption === SELECTION_OTHER_OPTION_KEY && !this.allowOtherValue(config)) ||
                (selectedOption === SELECTION_OTHER_OPTION_KEY && !(otherValue === null || otherValue === void 0 ? void 0 : otherValue.trim().length)) ||
                (selectedOption !== SELECTION_OTHER_OPTION_KEY && !config.options.includes(selectedOption))) {
                return false;
            }
        }
        return true;
    }
    isSingleValueInputType(type) {
        return SINGLE_VALUE_INPUT_TYPE.includes(type);
    }
    allowOtherValue(config) {
        return config.allowOther && config.inputType !== DataPointInputType.Dropdown;
    }
    prepareValue(config, value) {
        var _a, _b;
        if (!isObject(value) || !isArray(value.selection))
            return value;
        value.selection = (_a = value.selection) === null || _a === void 0 ? void 0 : _a.filter((key) => config.options.includes(key) ||
            (config.inputType !== DataPointInputType.Dropdown &&
                this.allowOtherValue(config) &&
                key === SELECTION_OTHER_OPTION_KEY));
        if (((_b = value.selection) === null || _b === void 0 ? void 0 : _b.length) > 1 &&
            [DataPointInputType.Dropdown, DataPointInputType.Radio].includes(config.inputType || DEFAULT_INPUT_TYPE)) {
            value.selection = [value.selection[0]];
        }
        return value;
    }
    prepareConfig(config) {
        if (config.inputType === DataPointInputType.Dropdown) {
            config.allowOther = false;
        }
    }
    getSettingKeys() {
        return ['allowOther', 'options'];
    }
}
useDataPointStrategyFacade().registerType(DataPointValueType.Selection, new SelectionDataPointStrategy());

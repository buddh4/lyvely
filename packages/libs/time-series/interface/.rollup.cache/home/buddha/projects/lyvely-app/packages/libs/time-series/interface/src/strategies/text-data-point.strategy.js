import { DataPointValueType, } from '../interfaces';
import { useDataPointStrategyFacade } from '../components';
import { TextDataPointModel } from '../models';
import { isString } from 'class-validator';
import { DataPointStrategy } from './data-point.strategy';
export class TextDataPointService extends DataPointStrategy {
    createDataPoint(raw) {
        return new TextDataPointModel(raw);
    }
    getSettingKeys() {
        return ['required'];
    }
    prepareValue(config, value) {
        return isString(value) ? value === null || value === void 0 ? void 0 : value.trim() : value;
    }
    async validateValue(config, value) {
        return isString(value) && !!(value === null || value === void 0 ? void 0 : value.trim().length);
    }
    prepareConfig(config) {
    }
}
useDataPointStrategyFacade().registerType(DataPointValueType.Text, new TextDataPointService());

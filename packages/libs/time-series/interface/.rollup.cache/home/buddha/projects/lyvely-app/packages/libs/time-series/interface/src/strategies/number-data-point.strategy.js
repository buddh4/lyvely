import { DataPointInputType, DataPointValueType, } from '../interfaces';
import { useDataPointStrategyFacade } from '../components';
import { NumberDataPointModel } from '../models';
import { isDefined, isNumber } from 'class-validator';
import { DataPointStrategy } from './data-point.strategy';
export class NumberDataPointStrategy extends DataPointStrategy {
    createDataPoint(raw) {
        return new NumberDataPointModel(raw);
    }
    async validateValue(config, value) {
        return isNumber(value) && (!isDefined(config.max) || value <= config.max);
    }
    prepareValue(config, value) {
        return isDefined(config.max) && isNumber(value) ? Math.min(value, config.max) : value;
    }
    prepareConfig(config) {
        if (isDefined(config.optimal) && isDefined(config.max) && config.optimal > config.max)
            config.optimal = config.max;
        if (isDefined(config.min) && isDefined(config.max) && config.min > config.max)
            config.min = config.max;
        if (isDefined(config.min) && isDefined(config.optimal) && config.min > config.optimal)
            config.optimal = config.min;
        if (!isDefined(config.max) && config.inputType === DataPointInputType.Checkbox) {
            config.max = 1;
        }
        if (config.max && config.inputType === DataPointInputType.Checkbox) {
            config.max = Math.min(8, config.max);
        }
    }
    getSettingKeys() {
        return ['max', 'min', 'optimal'];
    }
}
useDataPointStrategyFacade().registerType(DataPointValueType.Number, new NumberDataPointStrategy());

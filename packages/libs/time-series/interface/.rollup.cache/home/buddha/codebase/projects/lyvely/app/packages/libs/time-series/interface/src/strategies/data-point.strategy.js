import { cloneDeep } from 'lodash';
export class DataPointStrategy {
    createRevision(config) {
        const rev = {
            validUntil: new Date(),
            interval: config.interval,
            inputType: config.inputType,
            valueType: config.valueType,
        };
        this.populateDataPointTypeSettings(rev, config);
        return rev;
    }
    populateDataPointTypeSettings(target, config) {
        for (const key of this.getSettingKeys()) {
            target[key] = cloneDeep(config[key]);
        }
    }
    populateDataPointConfig(target, config, history = false) {
        target.interval = config.interval;
        target.inputType = config.inputType;
        target.userStrategy = config.userStrategy;
        target.valueType = config.valueType;
        if (history) {
            target.history = config.history;
        }
        this.populateDataPointTypeSettings(target, config);
    }
}

import { useSingleton, IntegrityException } from '@lyvely/common';
export class DataPointStrategyFacade {
    constructor() {
        this.types = new Map();
    }
    registerType(valueType, type) {
        this.types.set(valueType, type);
    }
    getService(valueType) {
        const service = this.types.get(valueType);
        if (!service) {
            throw new IntegrityException('Unknown data point strategy value type ' + valueType);
        }
        return service;
    }
    getSettingKeys(valueType) {
        return this.getService(valueType).getSettingKeys();
    }
    populateDataPointConfig(target, config) {
        return this.getService(config.valueType).populateDataPointConfig(target, config);
    }
    createDataPoint(raw) {
        return this.getService(raw.valueType).createDataPoint(raw);
    }
    async validateValue(config, value) {
        return this.getService(config.valueType).validateValue(config, value);
    }
    prepareValue(config, value) {
        return this.getService(config.valueType).prepareValue(config, value);
    }
    prepareConfig(config) {
        return this.getService(config.valueType).prepareConfig(config);
    }
    createRevision(config) {
        return this.getService(config.valueType).createRevision(config);
    }
}
export const useDataPointStrategyFacade = useSingleton(() => new DataPointStrategyFacade());

import { sortBySortOrder } from '@lyvely/common';
export class CalendarPlanStore {
    constructor(models) {
        this.models = new Map();
        if (models === null || models === void 0 ? void 0 : models.length)
            this.setModels(models);
    }
    reset() {
        this.models = new Map();
    }
    sort(models) {
        return models.sort(sortBySortOrder);
    }
    getId(model) {
        if (typeof model === 'string')
            return model;
        return model.id.toString();
    }
    handleResponse(response) {
        this.setModels(response.models);
    }
    setModel(model) {
        this.models.set(this.getId(model), model);
    }
    setModels(models) {
        const newModel = new Map(models.map((model) => [this.getId(model), model]));
        this.models = new Map([...this.models, ...newModel]);
    }
    getModel(model) {
        if (!this.hasModel(model)) {
            return null;
        }
        return this.models.get(this.getId(model)) || null;
    }
    getModels() {
        return Array.from(this.models.values());
    }
    hasModel(model) {
        return this.models.has(this.getId(model));
    }
    getModelsByIntervalFilter(interval, filter, tid) {
        return this.filterModels((entry) => {
            return entry.interval === interval && (!filter || filter.check(entry));
        });
    }
    filterModels(filter) {
        return this.sort(Array.from(this.models.values()).filter(filter));
    }
}

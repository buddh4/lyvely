import { useDataPointStrategyFacade } from '../components';
import { CalendarPlanStore } from '@lyvely/calendar-plan-interface';
export class TimeSeriesStore extends CalendarPlanStore {
    constructor(models, dataPoints) {
        super(models);
        this.dataPoints = new Map();
        if (dataPoints === null || dataPoints === void 0 ? void 0 : dataPoints.length)
            this.setDataPoints(dataPoints);
    }
    handleResponse(response) {
        super.handleResponse(response);
        this.setDataPoints(response.dataPoints);
    }
    createDataPoint(model, tid) {
        return useDataPointStrategyFacade().createDataPoint({
            id: undefined,
            value: undefined,
            cid: model.id,
            interval: model.timeSeriesConfig.interval,
            valueType: model.timeSeriesConfig.valueType,
            date: new Date(),
            tid,
        });
    }
    reset() {
        super.reset();
        this.dataPoints = new Map();
    }
    setDataPoint(dataPoint) {
        this._setDataPoint(dataPoint, this.dataPoints);
    }
    setDataPoints(dataPoints) {
        if (!dataPoints)
            return;
        const update = new Map([...this.dataPoints]);
        dataPoints.forEach((dataPoint) => {
            this._setDataPoint(dataPoint, update);
        });
        this.dataPoints = update;
    }
    _setDataPoint(dataPoint, dataPoints) {
        var _a;
        const modelId = dataPoint.cid;
        if (!modelId)
            return;
        if (!dataPoints.has(modelId)) {
            dataPoints.set(modelId, new Map());
        }
        (_a = dataPoints.get(modelId)) === null || _a === void 0 ? void 0 : _a.set(dataPoint.tid, dataPoint);
    }
    getDataPoint(identity, timingId, create = false) {
        var _a;
        const modelId = this.getId(identity);
        if (!this.hasDataPoint(modelId, timingId)) {
            if (!create)
                return null;
            const model = this.getModel(modelId);
            if (!model)
                return null;
            this.setDataPoint(this.createDataPoint(model, timingId));
            return this.getDataPoint(model, timingId);
        }
        return ((_a = this.dataPoints.get(modelId)) === null || _a === void 0 ? void 0 : _a.get(timingId)) || null;
    }
    getDataPoints() {
        return Array.from(this.dataPoints.values());
    }
    hasDataPoint(identity, timingId) {
        var _a;
        const modelId = this.getId(identity);
        if (!this.dataPoints.has(modelId)) {
            return false;
        }
        return !!((_a = this.dataPoints.get(modelId)) === null || _a === void 0 ? void 0 : _a.has(timingId));
    }
}

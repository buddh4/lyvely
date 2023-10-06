import { __decorate, __metadata } from "tslib";
import { ContentModel } from '@lyvely/content-interface';
import { PropertyType } from '@lyvely/common';
import { Expose } from 'class-transformer';
export class TimeSeriesSummaryWindowEntryModel {
}
__decorate([
    Expose(),
    __metadata("design:type", String)
], TimeSeriesSummaryWindowEntryModel.prototype, "tid", void 0);
__decorate([
    Expose(),
    __metadata("design:type", Number)
], TimeSeriesSummaryWindowEntryModel.prototype, "value", void 0);
export class TimeSeriesSummaryModel {
}
__decorate([
    Expose(),
    PropertyType([TimeSeriesSummaryWindowEntryModel]),
    __metadata("design:type", Array)
], TimeSeriesSummaryModel.prototype, "window", void 0);
let TimeSeriesContentModel = class TimeSeriesContentModel extends ContentModel {
    get interval() {
        return this.timeSeriesConfig.interval;
    }
    set interval(interval) {
        this.timeSeriesConfig.interval = interval;
    }
    get timeSeriesConfig() {
        return this.config.timeSeries;
    }
    set timeSeriesConfig(config) {
        this.config.timeSeries = config;
    }
};
__decorate([
    Expose(),
    PropertyType(TimeSeriesSummaryModel),
    __metadata("design:type", TimeSeriesSummaryModel)
], TimeSeriesContentModel.prototype, "timeSeriesSummary", void 0);
TimeSeriesContentModel = __decorate([
    Expose()
], TimeSeriesContentModel);
export { TimeSeriesContentModel };

import { __decorate, __metadata } from "tslib";
import { Expose } from 'class-transformer';
import { BaseModel, PropertyType } from '@lyvely/common';
import { DataPointModel } from './data-point.model';
import { TimeSeriesContentModel } from './time-series-content.model';
let UpdateDataPointResponse = class UpdateDataPointResponse extends BaseModel {
};
__decorate([
    PropertyType(DataPointModel),
    __metadata("design:type", DataPointModel)
], UpdateDataPointResponse.prototype, "dataPoint", void 0);
__decorate([
    PropertyType(TimeSeriesContentModel),
    __metadata("design:type", TimeSeriesContentModel)
], UpdateDataPointResponse.prototype, "model", void 0);
UpdateDataPointResponse = __decorate([
    Expose()
], UpdateDataPointResponse);
export { UpdateDataPointResponse };

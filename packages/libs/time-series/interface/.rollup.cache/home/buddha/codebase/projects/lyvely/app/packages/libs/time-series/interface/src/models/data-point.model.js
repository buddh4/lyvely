import { __decorate, __metadata } from "tslib";
import { CalendarInterval } from '@lyvely/dates';
import { DocumentModel, TransformObjectId } from '@lyvely/common';
import { Exclude, Expose } from 'class-transformer';
let DataPointModel = class DataPointModel extends DocumentModel {
};
__decorate([
    Expose(),
    TransformObjectId(),
    __metadata("design:type", Object)
], DataPointModel.prototype, "cid", void 0);
__decorate([
    Expose(),
    TransformObjectId(),
    __metadata("design:type", Object)
], DataPointModel.prototype, "uid", void 0);
__decorate([
    Expose(),
    __metadata("design:type", Date)
], DataPointModel.prototype, "date", void 0);
__decorate([
    Expose(),
    __metadata("design:type", Number)
], DataPointModel.prototype, "interval", void 0);
__decorate([
    Expose(),
    __metadata("design:type", String)
], DataPointModel.prototype, "tid", void 0);
__decorate([
    Expose(),
    __metadata("design:type", String)
], DataPointModel.prototype, "valueType", void 0);
__decorate([
    Expose(),
    __metadata("design:type", Object)
], DataPointModel.prototype, "value", void 0);
DataPointModel = __decorate([
    Exclude()
], DataPointModel);
export { DataPointModel };

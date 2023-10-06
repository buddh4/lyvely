import { __decorate, __metadata } from "tslib";
import { Exclude, Expose } from 'class-transformer';
import { Matches } from 'class-validator';
import { REGEX_DATE_FORMAT } from '@lyvely/dates';
import { BaseModel } from '@lyvely/common';
let UpdateDataPointModel = class UpdateDataPointModel extends BaseModel {
};
__decorate([
    Expose(),
    Matches(REGEX_DATE_FORMAT),
    __metadata("design:type", String)
], UpdateDataPointModel.prototype, "date", void 0);
__decorate([
    Expose(),
    __metadata("design:type", Object)
], UpdateDataPointModel.prototype, "value", void 0);
UpdateDataPointModel = __decorate([
    Exclude()
], UpdateDataPointModel);
export { UpdateDataPointModel };

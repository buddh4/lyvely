import { __decorate, __metadata } from "tslib";
import { Exclude, Expose } from 'class-transformer';
import { MilestoneModel } from './milestone.model';
import { BaseModel, PropertyType, TransformTo } from '@lyvely/common';
let MilestoneListResponse = class MilestoneListResponse extends BaseModel {
};
__decorate([
    Expose(),
    TransformTo(MilestoneModel),
    PropertyType([MilestoneModel]),
    __metadata("design:type", Array)
], MilestoneListResponse.prototype, "models", void 0);
MilestoneListResponse = __decorate([
    Exclude()
], MilestoneListResponse);
export { MilestoneListResponse };

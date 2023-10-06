import { __decorate, __metadata } from "tslib";
import { Exclude, Expose } from 'class-transformer';
import { IsMongoId } from 'class-validator';
import { BaseModel } from '@lyvely/common';
let SetMilestoneModel = class SetMilestoneModel extends BaseModel {
};
__decorate([
    Expose(),
    IsMongoId(),
    __metadata("design:type", String)
], SetMilestoneModel.prototype, "mid", void 0);
SetMilestoneModel = __decorate([
    Exclude()
], SetMilestoneModel);
export { SetMilestoneModel };

import { __decorate, __metadata } from "tslib";
import { Exclude, Expose, Type } from 'class-transformer';
import { TagModel } from '@lyvely/profiles-interface';
import { PropertyType } from '@lyvely/common';
import { MilestoneModel } from './milestone.model';
import { ContentUpdateResponse } from '@lyvely/content';
let UpdateMilestoneResponse = class UpdateMilestoneResponse extends ContentUpdateResponse {
};
__decorate([
    Expose(),
    Type(() => MilestoneModel),
    PropertyType(MilestoneModel),
    __metadata("design:type", MilestoneModel)
], UpdateMilestoneResponse.prototype, "model", void 0);
__decorate([
    Expose(),
    Type(() => TagModel),
    __metadata("design:type", Array)
], UpdateMilestoneResponse.prototype, "tags", void 0);
UpdateMilestoneResponse = __decorate([
    Exclude()
], UpdateMilestoneResponse);
export { UpdateMilestoneResponse };

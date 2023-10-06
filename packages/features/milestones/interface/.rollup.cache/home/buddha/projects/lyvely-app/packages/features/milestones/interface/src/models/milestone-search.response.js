import { __decorate, __metadata } from "tslib";
import { Exclude, Expose } from 'class-transformer';
import { MilestoneModel } from './milestone.model';
import { BaseModel, PropertyType, TransformTo } from '@lyvely/common';
import { MilestoneRelationModel } from './milestone-relation.model';
let MilestoneSearchResponse = class MilestoneSearchResponse extends BaseModel {
};
__decorate([
    Expose(),
    TransformTo(MilestoneModel),
    PropertyType([MilestoneModel]),
    __metadata("design:type", Array)
], MilestoneSearchResponse.prototype, "models", void 0);
__decorate([
    Expose(),
    TransformTo(MilestoneRelationModel),
    PropertyType([MilestoneRelationModel]),
    __metadata("design:type", Array)
], MilestoneSearchResponse.prototype, "relations", void 0);
MilestoneSearchResponse = __decorate([
    Exclude()
], MilestoneSearchResponse);
export { MilestoneSearchResponse };

import { __decorate, __metadata } from "tslib";
import { Exclude } from 'class-transformer';
import { PartialType } from '@buddh4/mapped-types';
import { CreateMilestoneModel } from './create-milestone.model';
let UpdateMilestoneModel = class UpdateMilestoneModel extends PartialType(CreateMilestoneModel) {
    constructor(model) {
        super(model, false);
    }
};
UpdateMilestoneModel = __decorate([
    Exclude(),
    __metadata("design:paramtypes", [Object])
], UpdateMilestoneModel);
export { UpdateMilestoneModel };

import { __decorate, __metadata } from "tslib";
import { Exclude, Expose } from 'class-transformer';
import { ProfileRelationDetailsModel, ProfileRelationModel } from './profile-relation.model';
import { BaseUserProfileRelationType, ProfileModel } from './profile.model';
import { PropertyType, TransformTo } from '@lyvely/common';
let ProfileWithRelationsModel = class ProfileWithRelationsModel extends ProfileModel {
    constructor(obj) {
        super(obj);
    }
    getMembership() {
        return (this.userRelations.find((relation) => relation.type === BaseUserProfileRelationType.Membership));
    }
};
__decorate([
    Expose(),
    PropertyType([ProfileRelationDetailsModel]),
    TransformTo(ProfileRelationDetailsModel),
    __metadata("design:type", Array)
], ProfileWithRelationsModel.prototype, "userRelations", void 0);
__decorate([
    Expose(),
    PropertyType([ProfileRelationModel]),
    TransformTo(ProfileRelationModel),
    __metadata("design:type", Array)
], ProfileWithRelationsModel.prototype, "profileRelations", void 0);
ProfileWithRelationsModel = __decorate([
    Exclude(),
    __metadata("design:paramtypes", [Object])
], ProfileWithRelationsModel);
export { ProfileWithRelationsModel };

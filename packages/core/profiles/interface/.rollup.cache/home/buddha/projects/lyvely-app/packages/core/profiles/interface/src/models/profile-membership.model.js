import { __decorate, __metadata } from "tslib";
import { Exclude, Expose } from 'class-transformer';
import { ProfileRelationModel } from './profile-relation.model';
let MembershipModel = class MembershipModel extends ProfileRelationModel {
};
__decorate([
    Expose(),
    __metadata("design:type", String)
], MembershipModel.prototype, "role", void 0);
MembershipModel = __decorate([
    Exclude()
], MembershipModel);
export { MembershipModel };

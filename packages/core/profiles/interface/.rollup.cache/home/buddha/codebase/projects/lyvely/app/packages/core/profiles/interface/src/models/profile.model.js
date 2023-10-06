import { __decorate, __metadata } from "tslib";
import { Exclude, Expose, Type } from 'class-transformer';
import { BaseModel, DocumentModel } from '@lyvely/common';
import { ProfileType, ProfileVisibilityLevel } from '../interfaces';
import { IsArray, IsEnum, IsInt, IsOptional, IsString, Length, Min } from 'class-validator';
import { TagModel } from './tag.model';
export const MIN_PROFILE_NAME_LENGTH = 1;
export const MAX_PROFILE_NAME_LENGTH = 100;
export const MAX_PROFILE_DESCRIPTION_LENGTH = 200;
let ProfileInfoModel = class ProfileInfoModel extends BaseModel {
};
ProfileInfoModel = __decorate([
    Expose()
], ProfileInfoModel);
export { ProfileInfoModel };
let ProfileModel = class ProfileModel extends DocumentModel {
};
__decorate([
    Expose(),
    IsString(),
    Length(MIN_PROFILE_NAME_LENGTH, MAX_PROFILE_NAME_LENGTH),
    __metadata("design:type", String)
], ProfileModel.prototype, "name", void 0);
__decorate([
    Expose(),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], ProfileModel.prototype, "description", void 0);
__decorate([
    Expose(),
    IsInt(),
    Min(0),
    __metadata("design:type", Number)
], ProfileModel.prototype, "score", void 0);
__decorate([
    Expose(),
    IsEnum(ProfileType),
    __metadata("design:type", String)
], ProfileModel.prototype, "type", void 0);
__decorate([
    Expose(),
    IsEnum(ProfileVisibilityLevel),
    __metadata("design:type", Number)
], ProfileModel.prototype, "visibility", void 0);
__decorate([
    Expose(),
    IsString(),
    __metadata("design:type", String)
], ProfileModel.prototype, "locale", void 0);
__decorate([
    Expose(),
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], ProfileModel.prototype, "guid", void 0);
__decorate([
    Expose(),
    Type(() => TagModel),
    IsArray(),
    __metadata("design:type", Array)
], ProfileModel.prototype, "tags", void 0);
ProfileModel = __decorate([
    Exclude()
], ProfileModel);
export { ProfileModel };
export var ProfileUsage;
(function (ProfileUsage) {
    ProfileUsage["Business"] = "Business";
    ProfileUsage["Private"] = "Private";
    ProfileUsage["Health"] = "Health";
    ProfileUsage["School"] = "School";
    ProfileUsage["Family"] = "Family";
    ProfileUsage["Improvement"] = "Improvement";
})(ProfileUsage || (ProfileUsage = {}));
export var BaseUserProfileRelationType;
(function (BaseUserProfileRelationType) {
    BaseUserProfileRelationType["Membership"] = "Membership";
})(BaseUserProfileRelationType || (BaseUserProfileRelationType = {}));
export var BaseMembershipRole;
(function (BaseMembershipRole) {
    BaseMembershipRole["Owner"] = "owner";
    BaseMembershipRole["Admin"] = "admin";
    BaseMembershipRole["Moderator"] = "moderator";
    BaseMembershipRole["Member"] = "member";
    BaseMembershipRole["Guest"] = "guest";
})(BaseMembershipRole || (BaseMembershipRole = {}));
export var BaseProfileRelationRole;
(function (BaseProfileRelationRole) {
    BaseProfileRelationRole["Owner"] = "owner";
    BaseProfileRelationRole["Admin"] = "admin";
    BaseProfileRelationRole["Moderator"] = "moderator";
    BaseProfileRelationRole["Member"] = "member";
    BaseProfileRelationRole["Guest"] = "guest";
    BaseProfileRelationRole["Organization"] = "organization";
    BaseProfileRelationRole["InvitedMember"] = "member_invited";
    BaseProfileRelationRole["RequestedMember"] = "member_requested";
    BaseProfileRelationRole["Follower"] = "follower";
    BaseProfileRelationRole["User"] = "user";
    BaseProfileRelationRole["Visitor"] = "visitor";
})(BaseProfileRelationRole || (BaseProfileRelationRole = {}));
const multiUserProfiles = [ProfileType.Group, ProfileType.Organization];
export function isMultiUserProfile(modelOrType) {
    const type = modelOrType instanceof ProfileModel ? modelOrType.type : modelOrType;
    return type && multiUserProfiles.includes(type);
}

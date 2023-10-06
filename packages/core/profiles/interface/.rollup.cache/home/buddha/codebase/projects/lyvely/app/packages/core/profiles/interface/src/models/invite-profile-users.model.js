import { __decorate, __metadata } from "tslib";
import { Exclude, Expose, Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { BaseModel, PropertyType } from '@lyvely/common';
import { BaseMembershipRole } from './profile.model';
let ProfileMemberMailInvite = class ProfileMemberMailInvite extends BaseModel {
};
__decorate([
    Expose(),
    IsString(),
    __metadata("design:type", String)
], ProfileMemberMailInvite.prototype, "email", void 0);
__decorate([
    Expose(),
    IsString(),
    IsOptional(),
    PropertyType(String, { default: BaseMembershipRole.Member }),
    __metadata("design:type", String)
], ProfileMemberMailInvite.prototype, "role", void 0);
ProfileMemberMailInvite = __decorate([
    Exclude()
], ProfileMemberMailInvite);
export { ProfileMemberMailInvite };
let InviteProfileMembers = class InviteProfileMembers {
};
__decorate([
    Expose(),
    IsArray(),
    Type(() => ProfileMemberMailInvite),
    PropertyType([ProfileMemberMailInvite]),
    ValidateNested(),
    __metadata("design:type", Array)
], InviteProfileMembers.prototype, "invites", void 0);
InviteProfileMembers = __decorate([
    Exclude()
], InviteProfileMembers);
export { InviteProfileMembers };

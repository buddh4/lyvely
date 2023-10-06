import { __decorate, __metadata } from "tslib";
import { Exclude, Expose, Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsEmail, IsEnum, IsMongoId, IsOptional, IsString, ValidateNested, } from 'class-validator';
import { BaseModel, PropertyType } from '@lyvely/common';
import { BaseMembershipRole } from '@lyvely/profiles-interface';
let MailInvite = class MailInvite extends BaseModel {
};
__decorate([
    Expose(),
    IsString(),
    IsEmail(),
    __metadata("design:type", String)
], MailInvite.prototype, "email", void 0);
__decorate([
    Expose(),
    IsEnum([BaseMembershipRole.Member, BaseMembershipRole.Guest]),
    IsOptional(),
    __metadata("design:type", String)
], MailInvite.prototype, "role", void 0);
MailInvite = __decorate([
    Exclude()
], MailInvite);
export { MailInvite };
let InvitationRequest = class InvitationRequest extends BaseModel {
};
__decorate([
    Expose(),
    IsArray(),
    ArrayNotEmpty(),
    Type(() => MailInvite),
    PropertyType(MailInvite),
    ValidateNested(),
    __metadata("design:type", Array)
], InvitationRequest.prototype, "invites", void 0);
__decorate([
    Expose(),
    IsMongoId(),
    IsOptional(),
    __metadata("design:type", String)
], InvitationRequest.prototype, "pid", void 0);
InvitationRequest = __decorate([
    Exclude()
], InvitationRequest);
export { InvitationRequest };
let MailInvitationInfo = class MailInvitationInfo extends BaseModel {
};
__decorate([
    Expose(),
    __metadata("design:type", String)
], MailInvitationInfo.prototype, "email", void 0);
__decorate([
    Expose(),
    __metadata("design:type", String)
], MailInvitationInfo.prototype, "pid", void 0);
__decorate([
    Expose(),
    __metadata("design:type", String)
], MailInvitationInfo.prototype, "profileName", void 0);
__decorate([
    Expose(),
    __metadata("design:type", String)
], MailInvitationInfo.prototype, "profileGuid", void 0);
__decorate([
    Expose(),
    __metadata("design:type", String)
], MailInvitationInfo.prototype, "hostName", void 0);
__decorate([
    Expose(),
    __metadata("design:type", String)
], MailInvitationInfo.prototype, "hostGuid", void 0);
__decorate([
    Expose(),
    __metadata("design:type", String)
], MailInvitationInfo.prototype, "hostId", void 0);
__decorate([
    Expose(),
    __metadata("design:type", Boolean)
], MailInvitationInfo.prototype, "isVerifiedMail", void 0);
MailInvitationInfo = __decorate([
    Exclude()
], MailInvitationInfo);
export { MailInvitationInfo };
let UserInvitationInfo = class UserInvitationInfo extends BaseModel {
};
__decorate([
    Expose(),
    __metadata("design:type", String)
], UserInvitationInfo.prototype, "pid", void 0);
__decorate([
    Expose(),
    __metadata("design:type", String)
], UserInvitationInfo.prototype, "profileName", void 0);
__decorate([
    Expose(),
    __metadata("design:type", String)
], UserInvitationInfo.prototype, "profileGuid", void 0);
__decorate([
    Expose(),
    __metadata("design:type", String)
], UserInvitationInfo.prototype, "hostId", void 0);
__decorate([
    Expose(),
    __metadata("design:type", String)
], UserInvitationInfo.prototype, "hostName", void 0);
__decorate([
    Expose(),
    __metadata("design:type", String)
], UserInvitationInfo.prototype, "hostGuid", void 0);
UserInvitationInfo = __decorate([
    Exclude()
], UserInvitationInfo);
export { UserInvitationInfo };

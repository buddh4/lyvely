import { __decorate, __metadata } from "tslib";
import { Exclude, Expose } from 'class-transformer';
import { IsOptional, IsString, Length, MaxLength } from 'class-validator';
import { MIN_USER_NAME_LENGTH, MAX_USER_NAME_LENGTH } from '@lyvely/users-interface';
import { BaseModel } from '@lyvely/common';
let UpdateProfileMembershipSettings = class UpdateProfileMembershipSettings extends BaseModel {
};
__decorate([
    Expose(),
    IsString(),
    Length(MIN_USER_NAME_LENGTH, MAX_USER_NAME_LENGTH),
    __metadata("design:type", String)
], UpdateProfileMembershipSettings.prototype, "displayName", void 0);
__decorate([
    Expose(),
    IsString(),
    MaxLength(MAX_USER_NAME_LENGTH),
    IsOptional(),
    __metadata("design:type", String)
], UpdateProfileMembershipSettings.prototype, "description", void 0);
UpdateProfileMembershipSettings = __decorate([
    Exclude()
], UpdateProfileMembershipSettings);
export { UpdateProfileMembershipSettings };

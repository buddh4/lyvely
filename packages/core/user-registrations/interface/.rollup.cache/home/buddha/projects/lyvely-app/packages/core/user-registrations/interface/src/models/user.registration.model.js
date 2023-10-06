import { __decorate, __metadata } from "tslib";
import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString, Length, MaxLength, MinLength, } from 'class-validator';
import { BaseModel, Match, NotMatch } from '@lyvely/common';
import { MAX_USER_NAME_LENGTH, MIN_USER_NAME_LENGTH } from '@lyvely/users-interface';
import { Exclude, Expose } from 'class-transformer';
let UserRegistration = class UserRegistration extends BaseModel {
};
__decorate([
    Expose(),
    IsString(),
    Length(MIN_USER_NAME_LENGTH, MAX_USER_NAME_LENGTH),
    IsNotEmpty(),
    NotMatch('email'),
    __metadata("design:type", String)
], UserRegistration.prototype, "username", void 0);
__decorate([
    Expose(),
    IsEmail(),
    IsNotEmpty(),
    MaxLength(254),
    __metadata("design:type", String)
], UserRegistration.prototype, "email", void 0);
__decorate([
    Expose(),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], UserRegistration.prototype, "locale", void 0);
__decorate([
    Expose(),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], UserRegistration.prototype, "inviteToken", void 0);
__decorate([
    Expose(),
    IsString(),
    MinLength(6),
    MaxLength(64),
    __metadata("design:type", String)
], UserRegistration.prototype, "password", void 0);
__decorate([
    Expose(),
    IsString(),
    IsNotEmpty(),
    Match('password'),
    __metadata("design:type", String)
], UserRegistration.prototype, "passwordRepeat", void 0);
__decorate([
    Expose(),
    IsOptional(),
    IsBoolean(),
    __metadata("design:type", Boolean)
], UserRegistration.prototype, "remember", void 0);
UserRegistration = __decorate([
    Exclude()
], UserRegistration);
export { UserRegistration };

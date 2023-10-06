import { __decorate, __metadata } from "tslib";
import { BaseModel, PropertyType } from '@lyvely/common';
import { IsBoolean, IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { Match } from '@lyvely/common';
export class SendResetPasswordMail extends BaseModel {
}
__decorate([
    IsEmail(),
    __metadata("design:type", String)
], SendResetPasswordMail.prototype, "email", void 0);
export class ResetPassword extends BaseModel {
}
__decorate([
    IsNotEmpty(),
    MinLength(6),
    MaxLength(64),
    __metadata("design:type", String)
], ResetPassword.prototype, "password", void 0);
__decorate([
    IsNotEmpty(),
    Match('password'),
    __metadata("design:type", String)
], ResetPassword.prototype, "passwordRepeat", void 0);
__decorate([
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], ResetPassword.prototype, "token", void 0);
__decorate([
    IsBoolean(),
    PropertyType(Boolean, { default: true }),
    __metadata("design:type", Boolean)
], ResetPassword.prototype, "resetSessions", void 0);

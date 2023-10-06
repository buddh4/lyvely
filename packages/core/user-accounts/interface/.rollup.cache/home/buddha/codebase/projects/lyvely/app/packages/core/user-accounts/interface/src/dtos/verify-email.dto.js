import { __decorate, __metadata } from "tslib";
import { IsEmail, IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { BaseModel } from '@lyvely/common';
export class VerifyEmailDto extends BaseModel {
}
__decorate([
    IsEmail(),
    __metadata("design:type", String)
], VerifyEmailDto.prototype, "email", void 0);
__decorate([
    IsString(),
    IsNotEmpty(),
    Length(6, 6),
    Matches('\\d{6}'),
    __metadata("design:type", String)
], VerifyEmailDto.prototype, "otp", void 0);

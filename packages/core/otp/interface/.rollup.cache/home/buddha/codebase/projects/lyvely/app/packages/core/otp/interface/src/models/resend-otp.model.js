import { __decorate, __metadata } from "tslib";
import { IsBoolean, IsEmail, IsOptional } from 'class-validator';
import { BaseModel } from '@lyvely/common';
import { Expose } from 'class-transformer';
let ResendOtp = class ResendOtp extends BaseModel {
};
__decorate([
    IsEmail(),
    __metadata("design:type", String)
], ResendOtp.prototype, "email", void 0);
__decorate([
    IsBoolean(),
    IsOptional(),
    __metadata("design:type", Boolean)
], ResendOtp.prototype, "remember", void 0);
ResendOtp = __decorate([
    Expose()
], ResendOtp);
export { ResendOtp };

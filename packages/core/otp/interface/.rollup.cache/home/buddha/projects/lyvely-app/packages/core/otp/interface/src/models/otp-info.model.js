import { __decorate, __metadata } from "tslib";
import { Exclude, Expose } from 'class-transformer';
import { BaseModel, PropertyType } from '@lyvely/common';
import { addMilliSeconds } from '@lyvely/dates';
export const DEFAULT_MAX_OTP_ATTEMPTS = 4;
let OtpInfo = class OtpInfo extends BaseModel {
    afterInit() {
        var _a;
        this.maxAttempts = (_a = this.maxAttempts) !== null && _a !== void 0 ? _a : DEFAULT_MAX_OTP_ATTEMPTS;
    }
    requiresRefresh() {
        return !this.hasAttemptsLeft() || this.isExpired();
    }
    hasAttemptsLeft() {
        return this.maxAttempts > this.attempts;
    }
    isExpired() {
        return addMilliSeconds(this.issuedAt, this.expiresIn) < new Date();
    }
};
__decorate([
    Expose(),
    PropertyType(Date),
    __metadata("design:type", Date)
], OtpInfo.prototype, "issuedAt", void 0);
__decorate([
    Expose(),
    __metadata("design:type", Number)
], OtpInfo.prototype, "expiresIn", void 0);
__decorate([
    Expose(),
    __metadata("design:type", Number)
], OtpInfo.prototype, "maxAttempts", void 0);
__decorate([
    PropertyType(Number, { default: 0 }),
    __metadata("design:type", Number)
], OtpInfo.prototype, "attempts", void 0);
OtpInfo = __decorate([
    Exclude()
], OtpInfo);
export { OtpInfo };

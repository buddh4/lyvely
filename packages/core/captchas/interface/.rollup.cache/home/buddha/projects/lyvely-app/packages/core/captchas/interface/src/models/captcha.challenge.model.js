import { __decorate, __metadata } from "tslib";
import { Expose } from 'class-transformer';
import { addMilliSeconds } from '@lyvely/dates';
import { BaseModel, PropertyType } from '@lyvely/common';
let CaptchaChallenge = class CaptchaChallenge extends BaseModel {
    isExpired() {
        return addMilliSeconds(this.issuedAt, this.expiresIn) < new Date();
    }
};
__decorate([
    PropertyType(Date),
    __metadata("design:type", Date)
], CaptchaChallenge.prototype, "issuedAt", void 0);
CaptchaChallenge = __decorate([
    Expose()
], CaptchaChallenge);
export { CaptchaChallenge };

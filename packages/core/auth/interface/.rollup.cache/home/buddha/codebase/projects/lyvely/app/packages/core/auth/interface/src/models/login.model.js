import { __decorate, __metadata } from "tslib";
import { Expose } from 'class-transformer';
import { IsBoolean, IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
let LoginModel = class LoginModel {
};
__decorate([
    IsEmail(),
    __metadata("design:type", String)
], LoginModel.prototype, "email", void 0);
__decorate([
    IsNotEmpty(),
    __metadata("design:type", String)
], LoginModel.prototype, "password", void 0);
__decorate([
    IsOptional(),
    IsBoolean(),
    __metadata("design:type", Boolean)
], LoginModel.prototype, "remember", void 0);
LoginModel = __decorate([
    Expose()
], LoginModel);
export { LoginModel };

import { __decorate, __metadata } from "tslib";
import { Expose } from 'class-transformer';
import { IsEmail } from 'class-validator';
import { BaseModel } from '@lyvely/common';
let AddEmailDto = class AddEmailDto extends BaseModel {
};
__decorate([
    IsEmail(),
    __metadata("design:type", String)
], AddEmailDto.prototype, "email", void 0);
AddEmailDto = __decorate([
    Expose()
], AddEmailDto);
export { AddEmailDto };

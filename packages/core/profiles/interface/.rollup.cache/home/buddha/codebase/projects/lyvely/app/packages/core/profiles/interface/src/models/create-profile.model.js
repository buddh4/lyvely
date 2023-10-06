import { __decorate, __metadata } from "tslib";
import { Exclude, Expose } from 'class-transformer';
import { BaseModel, PropertyType } from '@lyvely/common';
import { IsEnum, IsString, IsOptional, IsArray } from 'class-validator';
import { ProfileType } from '../interfaces';
import { ProfileUsage } from './index';
let CreateProfileModel = class CreateProfileModel extends BaseModel {
    constructor() {
        super(...arguments);
        this.usage = [];
    }
};
__decorate([
    Expose(),
    IsString(),
    __metadata("design:type", String)
], CreateProfileModel.prototype, "name", void 0);
__decorate([
    Expose(),
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateProfileModel.prototype, "description", void 0);
__decorate([
    Expose(),
    IsArray(),
    IsEnum(ProfileUsage, { each: true }),
    __metadata("design:type", Array)
], CreateProfileModel.prototype, "usage", void 0);
__decorate([
    Expose(),
    IsEnum(ProfileType),
    PropertyType(String, { default: ProfileType.User }),
    __metadata("design:type", String)
], CreateProfileModel.prototype, "type", void 0);
CreateProfileModel = __decorate([
    Exclude()
], CreateProfileModel);
export { CreateProfileModel };

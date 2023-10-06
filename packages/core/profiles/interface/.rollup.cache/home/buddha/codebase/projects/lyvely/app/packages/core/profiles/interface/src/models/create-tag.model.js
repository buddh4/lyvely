import { __decorate, __metadata } from "tslib";
import { Expose, Exclude } from 'class-transformer';
import { IsNotEmpty, IsHexColor, IsString, IsOptional, IsBoolean } from 'class-validator';
import randomColor from 'randomcolor';
import { BaseModel } from '@lyvely/common';
let CreateTagModel = class CreateTagModel extends BaseModel {
    constructor(obj) {
        var _a;
        super(obj);
        this.includeOnFilter = (_a = this.includeOnFilter) !== null && _a !== void 0 ? _a : false;
        this.color = this.color || randomColor({ luminosity: 'dark' });
    }
};
__decorate([
    Expose(),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateTagModel.prototype, "name", void 0);
__decorate([
    Expose(),
    IsHexColor(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateTagModel.prototype, "color", void 0);
__decorate([
    Expose(),
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateTagModel.prototype, "description", void 0);
__decorate([
    Expose(),
    IsBoolean(),
    IsOptional(),
    __metadata("design:type", Boolean)
], CreateTagModel.prototype, "includeOnFilter", void 0);
CreateTagModel = __decorate([
    Exclude(),
    __metadata("design:paramtypes", [Object])
], CreateTagModel);
export { CreateTagModel };

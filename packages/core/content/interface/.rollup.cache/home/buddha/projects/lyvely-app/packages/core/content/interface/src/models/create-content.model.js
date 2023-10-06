import { __decorate, __metadata } from "tslib";
import { Expose } from 'class-transformer';
import { MaxLength, IsArray, IsOptional, IsString, IsMongoId } from 'class-validator';
import { BaseModel } from '@lyvely/common';
export class CreateContentModel extends BaseModel {
}
__decorate([
    Expose(),
    IsArray(),
    MaxLength(50, { each: true }),
    IsOptional(),
    __metadata("design:type", Array)
], CreateContentModel.prototype, "tagNames", void 0);
__decorate([
    Expose(),
    IsString(),
    IsOptional(),
    IsMongoId(),
    __metadata("design:type", String)
], CreateContentModel.prototype, "parentId", void 0);

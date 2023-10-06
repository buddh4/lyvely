import { __decorate, __metadata } from "tslib";
import { BaseModel } from '@lyvely/common';
import { IsArray, IsBoolean, IsMongoId, IsNumber, IsOptional, Min } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';
let StreamState = class StreamState extends BaseModel {
};
__decorate([
    Expose(),
    IsNumber(),
    Min(0),
    IsOptional(),
    __metadata("design:type", Number)
], StreamState.prototype, "head", void 0);
__decorate([
    Expose(),
    IsNumber(),
    Min(0),
    IsOptional(),
    __metadata("design:type", Number)
], StreamState.prototype, "tail", void 0);
__decorate([
    Expose(),
    IsMongoId({ each: true }),
    IsOptional(),
    IsArray(),
    __metadata("design:type", Array)
], StreamState.prototype, "tailIds", void 0);
__decorate([
    Expose(),
    IsMongoId({ each: true }),
    IsOptional(),
    IsArray(),
    __metadata("design:type", Array)
], StreamState.prototype, "headIds", void 0);
__decorate([
    Expose(),
    IsBoolean(),
    IsOptional(),
    __metadata("design:type", Boolean)
], StreamState.prototype, "isEnd", void 0);
StreamState = __decorate([
    Exclude()
], StreamState);
export { StreamState };

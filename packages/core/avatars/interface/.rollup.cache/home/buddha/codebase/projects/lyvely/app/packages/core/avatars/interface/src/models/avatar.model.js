import { __decorate, __metadata } from "tslib";
import { Exclude, Expose } from 'class-transformer';
import { BaseModel } from '@lyvely/common';
let AvatarModel = class AvatarModel extends BaseModel {
};
__decorate([
    Expose(),
    __metadata("design:type", String)
], AvatarModel.prototype, "guid", void 0);
__decorate([
    Expose(),
    __metadata("design:type", Number)
], AvatarModel.prototype, "timestamp", void 0);
AvatarModel = __decorate([
    Exclude()
], AvatarModel);
export { AvatarModel };

import { __decorate, __metadata } from "tslib";
import { Exclude, Expose, Type } from 'class-transformer';
import { BaseModel, TransformObjectId } from '@lyvely/common';
let ProfileRelationUserInfoDto = class ProfileRelationUserInfoDto {
};
__decorate([
    Expose(),
    __metadata("design:type", String)
], ProfileRelationUserInfoDto.prototype, "displayName", void 0);
__decorate([
    Expose(),
    __metadata("design:type", String)
], ProfileRelationUserInfoDto.prototype, "description", void 0);
__decorate([
    Exclude(),
    __metadata("design:type", String)
], ProfileRelationUserInfoDto.prototype, "email", void 0);
__decorate([
    Expose(),
    __metadata("design:type", String)
], ProfileRelationUserInfoDto.prototype, "guid", void 0);
ProfileRelationUserInfoDto = __decorate([
    Exclude()
], ProfileRelationUserInfoDto);
export { ProfileRelationUserInfoDto };
let ProfileRelationModel = class ProfileRelationModel extends BaseModel {
};
__decorate([
    Expose(),
    __metadata("design:type", String)
], ProfileRelationModel.prototype, "id", void 0);
__decorate([
    Expose(),
    TransformObjectId(),
    __metadata("design:type", Object)
], ProfileRelationModel.prototype, "oid", void 0);
__decorate([
    Expose(),
    TransformObjectId(),
    __metadata("design:type", Object)
], ProfileRelationModel.prototype, "pid", void 0);
__decorate([
    Expose(),
    TransformObjectId(),
    __metadata("design:type", Object)
], ProfileRelationModel.prototype, "uid", void 0);
__decorate([
    Expose(),
    __metadata("design:type", String)
], ProfileRelationModel.prototype, "type", void 0);
__decorate([
    Expose(),
    Type(() => ProfileRelationUserInfoDto),
    __metadata("design:type", ProfileRelationUserInfoDto)
], ProfileRelationModel.prototype, "userInfo", void 0);
__decorate([
    Expose(),
    __metadata("design:type", String)
], ProfileRelationModel.prototype, "role", void 0);
ProfileRelationModel = __decorate([
    Exclude()
], ProfileRelationModel);
export { ProfileRelationModel };
let ProfileRelationDetailsModel = class ProfileRelationDetailsModel extends ProfileRelationModel {
};
ProfileRelationDetailsModel = __decorate([
    Exclude()
], ProfileRelationDetailsModel);
export { ProfileRelationDetailsModel };

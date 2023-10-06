import { __decorate, __metadata } from "tslib";
import { BaseModel, DocumentModel, PropertyType, TransformObjectId, } from '@lyvely/common';
import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { IsString, Length, IsOptional } from 'class-validator';
export class ContentDataTypeModel extends BaseModel {
}
__decorate([
    IsString(),
    Length(1, 80),
    IsOptional(),
    __metadata("design:type", String)
], ContentDataTypeModel.prototype, "title", void 0);
__decorate([
    IsString(),
    Length(1, 500),
    IsOptional(),
    __metadata("design:type", String)
], ContentDataTypeModel.prototype, "text", void 0);
let ContentAuthor = class ContentAuthor extends BaseModel {
};
__decorate([
    TransformObjectId(),
    __metadata("design:type", Object)
], ContentAuthor.prototype, "authorId", void 0);
ContentAuthor = __decorate([
    Expose()
], ContentAuthor);
export { ContentAuthor };
let ContentMetadataModel = class ContentMetadataModel extends BaseModel {
};
__decorate([
    TransformObjectId(),
    __metadata("design:type", Object)
], ContentMetadataModel.prototype, "mid", void 0);
__decorate([
    TransformObjectId(),
    __metadata("design:type", Object)
], ContentMetadataModel.prototype, "createdBy", void 0);
__decorate([
    Type(() => ContentAuthor),
    __metadata("design:type", ContentAuthor)
], ContentMetadataModel.prototype, "createdAs", void 0);
__decorate([
    PropertyType(Date),
    __metadata("design:type", Date)
], ContentMetadataModel.prototype, "createdAt", void 0);
__decorate([
    PropertyType(Date),
    __metadata("design:type", Date)
], ContentMetadataModel.prototype, "updatedAt", void 0);
__decorate([
    TransformObjectId(),
    __metadata("design:type", Object)
], ContentMetadataModel.prototype, "parentId", void 0);
ContentMetadataModel = __decorate([
    Expose()
], ContentMetadataModel);
export { ContentMetadataModel };
let ContentLogModel = class ContentLogModel extends BaseModel {
};
__decorate([
    TransformObjectId(),
    __metadata("design:type", Object)
], ContentLogModel.prototype, "updatedBy", void 0);
ContentLogModel = __decorate([
    Expose()
], ContentLogModel);
export { ContentLogModel };
let ContentModel = class ContentModel extends DocumentModel {
    getDefaults() {
        return {
            config: this.getDefaultConfig(),
        };
    }
    getTitle() {
        return this.content.title || '';
    }
    getText() {
        return this.content.text || '';
    }
    getDefaultConfig() {
        return undefined;
    }
    getSortOrder() {
        return this.meta.sortOrder;
    }
};
__decorate([
    Expose(),
    __metadata("design:type", String)
], ContentModel.prototype, "id", void 0);
__decorate([
    Expose(),
    TransformObjectId(),
    __metadata("design:type", Object)
], ContentModel.prototype, "oid", void 0);
__decorate([
    Expose(),
    TransformObjectId(),
    __metadata("design:type", Object)
], ContentModel.prototype, "pid", void 0);
__decorate([
    Expose(),
    __metadata("design:type", String)
], ContentModel.prototype, "type", void 0);
__decorate([
    Expose(),
    Type(() => ContentDataTypeModel),
    PropertyType(ContentDataTypeModel),
    __metadata("design:type", ContentDataTypeModel)
], ContentModel.prototype, "content", void 0);
__decorate([
    Expose(),
    Type(() => ContentMetadataModel),
    PropertyType(ContentMetadataModel),
    __metadata("design:type", ContentMetadataModel)
], ContentModel.prototype, "meta", void 0);
__decorate([
    Expose(),
    Transform(({ obj }) => { var _a; return ((_a = obj.tagIds) === null || _a === void 0 ? void 0 : _a.map((id) => id.toString())) || []; }),
    __metadata("design:type", Array)
], ContentModel.prototype, "tagIds", void 0);
__decorate([
    Expose(),
    Type(() => ContentLogModel),
    __metadata("design:type", Array)
], ContentModel.prototype, "logs", void 0);
__decorate([
    Expose(),
    __metadata("design:type", Object)
], ContentModel.prototype, "config", void 0);
__decorate([
    Expose(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], ContentModel.prototype, "getDefaults", null);
ContentModel = __decorate([
    Exclude()
], ContentModel);
export { ContentModel };

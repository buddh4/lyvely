import { __decorate, __metadata } from "tslib";
import { TransformObjectId, BaseModel } from '@lyvely/common';
import { Exclude, Expose } from 'class-transformer';
let MilestoneRelationModel = class MilestoneRelationModel extends BaseModel {
    constructor(content, progress) {
        var _a;
        super({
            pid: content.pid,
            cid: content.id,
            mid: content.meta.mid,
            title: content.getTitle() || content.getText(),
            text: (_a = content.getText()) === null || _a === void 0 ? void 0 : _a.substring(0, 150),
            contentType: content.type,
            progress: typeof progress === 'number' ? progress : progress === null || progress === void 0 ? void 0 : progress.progress,
            tid: typeof progress === 'object' ? progress === null || progress === void 0 ? void 0 : progress.tid : undefined,
        });
    }
};
__decorate([
    Expose(),
    TransformObjectId(),
    __metadata("design:type", Object)
], MilestoneRelationModel.prototype, "pid", void 0);
__decorate([
    Expose(),
    TransformObjectId(),
    __metadata("design:type", Object)
], MilestoneRelationModel.prototype, "cid", void 0);
__decorate([
    Expose(),
    TransformObjectId(),
    __metadata("design:type", Object)
], MilestoneRelationModel.prototype, "mid", void 0);
__decorate([
    Expose(),
    __metadata("design:type", String)
], MilestoneRelationModel.prototype, "title", void 0);
__decorate([
    Expose(),
    __metadata("design:type", String)
], MilestoneRelationModel.prototype, "text", void 0);
__decorate([
    Expose(),
    __metadata("design:type", String)
], MilestoneRelationModel.prototype, "contentType", void 0);
__decorate([
    Expose(),
    __metadata("design:type", String)
], MilestoneRelationModel.prototype, "tid", void 0);
__decorate([
    Expose(),
    __metadata("design:type", Number)
], MilestoneRelationModel.prototype, "progress", void 0);
MilestoneRelationModel = __decorate([
    Exclude(),
    __metadata("design:paramtypes", [Object, Object])
], MilestoneRelationModel);
export { MilestoneRelationModel };

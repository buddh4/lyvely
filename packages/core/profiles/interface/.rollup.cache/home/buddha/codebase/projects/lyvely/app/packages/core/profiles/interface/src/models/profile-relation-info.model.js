import { __decorate, __metadata } from "tslib";
import { Exclude, Expose } from 'class-transformer';
import { BaseModel, PropertyType } from '@lyvely/common';
import { ProfileType } from '../interfaces';
import { BaseUserProfileRelationType, isMultiUserProfile } from '../models';
let ProfileRelationSummary = class ProfileRelationSummary {
};
__decorate([
    Expose(),
    __metadata("design:type", String)
], ProfileRelationSummary.prototype, "type", void 0);
__decorate([
    Expose(),
    __metadata("design:type", String)
], ProfileRelationSummary.prototype, "role", void 0);
ProfileRelationSummary = __decorate([
    Exclude()
], ProfileRelationSummary);
export { ProfileRelationSummary };
let ProfileRelationInfo = class ProfileRelationInfo extends BaseModel {
    isMultiUserProfile() {
        return isMultiUserProfile(this.type);
    }
    isMember(role) {
        return !!this.relations.find((relation) => relation.type === BaseUserProfileRelationType.Membership &&
            (!role || relation.role === role));
    }
};
__decorate([
    Expose(),
    __metadata("design:type", String)
], ProfileRelationInfo.prototype, "id", void 0);
__decorate([
    Expose(),
    __metadata("design:type", String)
], ProfileRelationInfo.prototype, "name", void 0);
__decorate([
    Expose(),
    __metadata("design:type", String)
], ProfileRelationInfo.prototype, "description", void 0);
__decorate([
    Expose(),
    __metadata("design:type", Number)
], ProfileRelationInfo.prototype, "score", void 0);
__decorate([
    Expose(),
    __metadata("design:type", String)
], ProfileRelationInfo.prototype, "type", void 0);
__decorate([
    Expose(),
    __metadata("design:type", String)
], ProfileRelationInfo.prototype, "guid", void 0);
__decorate([
    PropertyType([ProfileRelationSummary]),
    __metadata("design:type", Array)
], ProfileRelationInfo.prototype, "relations", void 0);
ProfileRelationInfo = __decorate([
    Exclude()
], ProfileRelationInfo);
export { ProfileRelationInfo };
let ProfileRelationInfos = class ProfileRelationInfos extends BaseModel {
};
__decorate([
    Expose(),
    PropertyType([ProfileRelationInfo]),
    __metadata("design:type", Array)
], ProfileRelationInfos.prototype, "profiles", void 0);
ProfileRelationInfos = __decorate([
    Exclude()
], ProfileRelationInfos);
export { ProfileRelationInfos };

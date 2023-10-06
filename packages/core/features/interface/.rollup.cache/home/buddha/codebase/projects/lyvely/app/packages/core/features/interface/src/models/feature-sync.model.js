import { __decorate, __metadata } from "tslib";
import { BaseModel } from '@lyvely/common';
import { Expose } from 'class-transformer';
let FeatureSyncModel = class FeatureSyncModel extends BaseModel {
    constructor(feature) {
        const ts = Date.now();
        super({
            updatedAt: ts,
        });
    }
    loaded() {
        this.loadedAt = Date.now();
    }
    updatesAvailable() {
        return !this.loadedAt || this.loadedAt < this.updatedAt;
    }
};
FeatureSyncModel = __decorate([
    Expose(),
    __metadata("design:paramtypes", [String])
], FeatureSyncModel);
export { FeatureSyncModel };

import { __decorate, __metadata } from "tslib";
import { DocumentModel } from '@lyvely/common';
import { Expose, Exclude } from 'class-transformer';
import randomColor from 'randomcolor';
let TagModel = class TagModel extends DocumentModel {
    constructor(obj) {
        super(obj);
        this.color = this.color || randomColor({ luminosity: 'dark' });
    }
};
__decorate([
    Expose(),
    __metadata("design:type", String)
], TagModel.prototype, "name", void 0);
__decorate([
    Expose(),
    __metadata("design:type", String)
], TagModel.prototype, "color", void 0);
__decorate([
    Expose(),
    __metadata("design:type", String)
], TagModel.prototype, "description", void 0);
__decorate([
    Expose(),
    __metadata("design:type", Boolean)
], TagModel.prototype, "archived", void 0);
__decorate([
    Expose(),
    __metadata("design:type", Boolean)
], TagModel.prototype, "includeOnFilter", void 0);
TagModel = __decorate([
    Exclude(),
    __metadata("design:paramtypes", [Object])
], TagModel);
export { TagModel };

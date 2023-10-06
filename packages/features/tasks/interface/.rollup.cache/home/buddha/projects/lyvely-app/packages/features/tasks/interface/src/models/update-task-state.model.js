import { __decorate, __metadata } from "tslib";
import { Matches } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';
import { REGEX_DATE_FORMAT } from '@lyvely/dates';
let UpdateTaskStateModel = class UpdateTaskStateModel {
    constructor(obj) {
        Object.assign(this, obj);
    }
};
__decorate([
    Expose(),
    Matches(REGEX_DATE_FORMAT),
    __metadata("design:type", String)
], UpdateTaskStateModel.prototype, "date", void 0);
UpdateTaskStateModel = __decorate([
    Exclude(),
    __metadata("design:paramtypes", [Object])
], UpdateTaskStateModel);
export { UpdateTaskStateModel };

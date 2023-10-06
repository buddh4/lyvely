import { __decorate, __metadata } from "tslib";
import { Exclude, Expose } from 'class-transformer';
import { Matches } from 'class-validator';
import { formatDate, REGEX_DATE_FORMAT } from '@lyvely/dates';
import { BaseModel } from '@lyvely/common';
let TimerUpdateModel = class TimerUpdateModel extends BaseModel {
    constructor(date) {
        super({ date: formatDate(date) });
    }
};
__decorate([
    Expose(),
    Matches(REGEX_DATE_FORMAT),
    __metadata("design:type", String)
], TimerUpdateModel.prototype, "date", void 0);
TimerUpdateModel = __decorate([
    Exclude(),
    __metadata("design:paramtypes", [Object])
], TimerUpdateModel);
export { TimerUpdateModel };

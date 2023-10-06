import { __decorate, __metadata } from "tslib";
import { Exclude, Expose } from 'class-transformer';
import { IsNumber } from 'class-validator';
import { BaseModel } from '@lyvely/common';
let TimerValueUpdateModel = class TimerValueUpdateModel extends BaseModel {
    constructor(value) {
        super({ value });
    }
};
__decorate([
    Expose(),
    IsNumber(),
    __metadata("design:type", Number)
], TimerValueUpdateModel.prototype, "value", void 0);
TimerValueUpdateModel = __decorate([
    Exclude(),
    __metadata("design:paramtypes", [Number])
], TimerValueUpdateModel);
export { TimerValueUpdateModel };

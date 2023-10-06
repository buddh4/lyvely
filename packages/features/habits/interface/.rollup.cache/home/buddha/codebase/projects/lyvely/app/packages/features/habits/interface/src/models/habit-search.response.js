import { __decorate, __metadata } from "tslib";
import { Exclude, Type, Expose } from 'class-transformer';
import { BaseModel } from '@lyvely/common';
import { NumberDataPointModel, } from '@lyvely/time-series-interface';
import { HabitModel } from './habit.model';
let HabitSearchResponse = class HabitSearchResponse extends BaseModel {
};
__decorate([
    Expose(),
    Type(() => HabitModel),
    __metadata("design:type", Array)
], HabitSearchResponse.prototype, "models", void 0);
__decorate([
    Expose(),
    Type(() => NumberDataPointModel),
    __metadata("design:type", Array)
], HabitSearchResponse.prototype, "dataPoints", void 0);
HabitSearchResponse = __decorate([
    Exclude()
], HabitSearchResponse);
export { HabitSearchResponse };

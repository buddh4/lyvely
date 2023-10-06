import { __decorate, __metadata } from "tslib";
import { Expose } from 'class-transformer';
import { TimerDataPointModel, UpdateDataPointResponse } from '@lyvely/time-series-interface';
import { PropertyType } from '@lyvely/common';
let UpdateHabitDataPointResponse = class UpdateHabitDataPointResponse extends UpdateDataPointResponse {
};
UpdateHabitDataPointResponse = __decorate([
    Expose()
], UpdateHabitDataPointResponse);
export { UpdateHabitDataPointResponse };
let UpdateHabitDataPointTimerResponse = class UpdateHabitDataPointTimerResponse extends UpdateHabitDataPointResponse {
};
__decorate([
    PropertyType(TimerDataPointModel),
    __metadata("design:type", TimerDataPointModel)
], UpdateHabitDataPointTimerResponse.prototype, "dataPoint", void 0);
UpdateHabitDataPointTimerResponse = __decorate([
    Expose()
], UpdateHabitDataPointTimerResponse);
export { UpdateHabitDataPointTimerResponse };

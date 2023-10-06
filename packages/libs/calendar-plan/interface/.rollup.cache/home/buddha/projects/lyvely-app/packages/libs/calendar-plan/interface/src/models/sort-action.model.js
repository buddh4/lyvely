import { __decorate, __metadata } from "tslib";
import { Exclude, Expose } from 'class-transformer';
import { CalendarInterval } from '@lyvely/dates';
let CalendarPlanSort = class CalendarPlanSort {
    constructor(obj) {
        if (obj) {
            this.attachToId = obj.attachToId;
            this.interval = obj.interval || this.interval;
        }
    }
};
__decorate([
    Expose(),
    __metadata("design:type", String)
], CalendarPlanSort.prototype, "attachToId", void 0);
__decorate([
    Expose(),
    __metadata("design:type", Number)
], CalendarPlanSort.prototype, "interval", void 0);
CalendarPlanSort = __decorate([
    Exclude(),
    __metadata("design:paramtypes", [Object])
], CalendarPlanSort);
export { CalendarPlanSort };

import { __decorate, __metadata } from "tslib";
import { Exclude, Expose, Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsMongoId, IsOptional, IsString, Matches } from 'class-validator';
import { CalendarInterval, formatDate, REGEX_DATE_FORMAT } from '@lyvely/dates';
import { BaseModel } from '@lyvely/common';
let CalendarPlanFilter = class CalendarPlanFilter extends BaseModel {
    constructor(date, level = CalendarInterval.Unscheduled, data) {
        super(data);
        this.date = formatDate(date);
        this.level = level;
    }
};
__decorate([
    Expose(),
    IsString(),
    Matches(REGEX_DATE_FORMAT),
    __metadata("design:type", String)
], CalendarPlanFilter.prototype, "date", void 0);
__decorate([
    Expose(),
    IsEnum(CalendarInterval),
    Transform((value) => parseInt(value.value, 10), { toClassOnly: true }),
    __metadata("design:type", Number)
], CalendarPlanFilter.prototype, "level", void 0);
__decorate([
    Expose(),
    IsBoolean(),
    IsOptional(),
    __metadata("design:type", Boolean)
], CalendarPlanFilter.prototype, "archived", void 0);
__decorate([
    Expose(),
    IsMongoId(),
    IsOptional(),
    __metadata("design:type", String)
], CalendarPlanFilter.prototype, "cid", void 0);
CalendarPlanFilter = __decorate([
    Exclude(),
    __metadata("design:paramtypes", [Object, Number, Object])
], CalendarPlanFilter);
export { CalendarPlanFilter };

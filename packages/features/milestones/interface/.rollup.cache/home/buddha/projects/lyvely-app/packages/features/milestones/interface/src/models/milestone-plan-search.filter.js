import { __decorate, __metadata } from "tslib";
import { CalendarPlanFilter } from '@lyvely/calendar-plan-interface';
import { Exclude } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';
import { PropertyType } from '@lyvely/common';
let MilestonePlanSearchFilter = class MilestonePlanSearchFilter extends CalendarPlanFilter {
};
__decorate([
    IsBoolean(),
    IsOptional(),
    PropertyType(Boolean, { default: true }),
    __metadata("design:type", Boolean)
], MilestonePlanSearchFilter.prototype, "withRelations", void 0);
MilestonePlanSearchFilter = __decorate([
    Exclude()
], MilestonePlanSearchFilter);
export { MilestonePlanSearchFilter };

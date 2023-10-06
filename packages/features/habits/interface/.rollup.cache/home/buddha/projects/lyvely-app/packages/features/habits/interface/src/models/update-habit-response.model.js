import { __decorate, __metadata } from "tslib";
import { Expose, Type } from 'class-transformer';
import { HabitModel } from './habit.model';
import { TagModel } from '@lyvely/profiles-interface';
import { PropertyType } from '@lyvely/common';
import { ContentUpdateResponse } from '@lyvely/content-interface';
export class UpdateHabitResponse extends ContentUpdateResponse {
}
__decorate([
    Expose(),
    Type(() => HabitModel),
    PropertyType(HabitModel),
    __metadata("design:type", HabitModel)
], UpdateHabitResponse.prototype, "model", void 0);
__decorate([
    Expose(),
    Type(() => TagModel),
    PropertyType([TagModel]),
    __metadata("design:type", Array)
], UpdateHabitResponse.prototype, "tags", void 0);

import { __decorate, __metadata } from "tslib";
import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, IsString, Length, IsEnum, IsOptional, IsArray, MaxLength, } from 'class-validator';
import { CalendarInterval } from '@lyvely/dates';
import { CreateContentModel } from '@lyvely/content-interface';
let CreateMilestoneModel = class CreateMilestoneModel extends CreateContentModel {
    getDefaults() {
        return {
            interval: CalendarInterval.Unscheduled,
            tagNames: [],
        };
    }
};
__decorate([
    Expose(),
    IsString(),
    IsNotEmpty(),
    Length(0, 100),
    __metadata("design:type", String)
], CreateMilestoneModel.prototype, "title", void 0);
__decorate([
    Expose(),
    IsOptional(),
    IsString(),
    Length(0, 2000),
    __metadata("design:type", String)
], CreateMilestoneModel.prototype, "text", void 0);
__decorate([
    Expose(),
    IsEnum(CalendarInterval),
    __metadata("design:type", Number)
], CreateMilestoneModel.prototype, "interval", void 0);
__decorate([
    Expose(),
    IsArray(),
    MaxLength(20, { each: true }),
    IsOptional(),
    __metadata("design:type", Array)
], CreateMilestoneModel.prototype, "tagNames", void 0);
CreateMilestoneModel = __decorate([
    Exclude()
], CreateMilestoneModel);
export { CreateMilestoneModel };

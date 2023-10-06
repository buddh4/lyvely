import { __decorate, __metadata } from "tslib";
import { Expose } from 'class-transformer';
import { CalendarInterval } from '@lyvely/dates';
import { DataPointInputType, DataPointValueType, } from '@lyvely/time-series-interface';
import { IsArray, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Length, Max, MaxLength, Min, } from 'class-validator';
import { BaseModel, Gte, Lte, UserAssignmentStrategy } from '@lyvely/common';
let CreateHabitModel = class CreateHabitModel extends BaseModel {
    getDefaults() {
        return {
            interval: CalendarInterval.Daily,
            tagNames: [],
            valueType: DataPointValueType.Number,
            inputType: DataPointInputType.Checkbox,
            userStrategy: UserAssignmentStrategy.Shared,
            optimal: 0,
            min: 0,
            max: 3,
            score: 2,
        };
    }
};
__decorate([
    IsString(),
    IsNotEmpty(),
    MaxLength(250),
    __metadata("design:type", String)
], CreateHabitModel.prototype, "title", void 0);
__decorate([
    IsString(),
    IsOptional(),
    Length(0, 2500),
    __metadata("design:type", String)
], CreateHabitModel.prototype, "text", void 0);
__decorate([
    IsEnum(CalendarInterval),
    __metadata("design:type", Number)
], CreateHabitModel.prototype, "interval", void 0);
__decorate([
    IsInt(),
    Max(100),
    Min(-100),
    __metadata("design:type", Number)
], CreateHabitModel.prototype, "score", void 0);
__decorate([
    IsInt(),
    Min(0),
    __metadata("design:type", Number)
], CreateHabitModel.prototype, "max", void 0);
__decorate([
    IsInt(),
    Lte('max'),
    IsOptional(),
    Min(0),
    __metadata("design:type", Number)
], CreateHabitModel.prototype, "min", void 0);
__decorate([
    IsInt(),
    Gte('min'),
    Lte('max'),
    Min(0),
    __metadata("design:type", Number)
], CreateHabitModel.prototype, "optimal", void 0);
__decorate([
    IsEnum([
        DataPointInputType.Checkbox,
        DataPointInputType.Spinner,
        DataPointInputType.Range,
        DataPointInputType.Timer,
    ]),
    __metadata("design:type", String)
], CreateHabitModel.prototype, "inputType", void 0);
__decorate([
    IsEnum(UserAssignmentStrategy),
    __metadata("design:type", Number)
], CreateHabitModel.prototype, "userStrategy", void 0);
__decorate([
    IsString(),
    IsEnum([DataPointValueType.Number, DataPointValueType.Timer]),
    __metadata("design:type", Object)
], CreateHabitModel.prototype, "valueType", void 0);
__decorate([
    IsArray(),
    MaxLength(20, { each: true }),
    IsOptional(),
    __metadata("design:type", Array)
], CreateHabitModel.prototype, "tagNames", void 0);
CreateHabitModel = __decorate([
    Expose()
], CreateHabitModel);
export { CreateHabitModel };

import { __decorate, __metadata } from "tslib";
import { Expose } from 'class-transformer';
import { IsArray, IsBoolean, IsDefined, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Length, MaxLength, Min, ValidateIf, } from 'class-validator';
import { CalendarInterval } from '@lyvely/dates';
import { UserAssignmentStrategy, Gte, Lte } from '@lyvely/common';
import { DataPointInputType, DataPointValueType } from '@lyvely/time-series-interface';
import { CreateContentModel } from '@lyvely/content';
let CreateJournalModel = class CreateJournalModel extends CreateContentModel {
    getDefaults() {
        return {
            interval: CalendarInterval.Daily,
            inputType: DataPointInputType.Range,
            valueType: DataPointValueType.Number,
            userStrategy: UserAssignmentStrategy.Shared,
            max: 10,
            min: 5,
            optimal: 6,
            tagNames: [],
        };
    }
};
__decorate([
    IsString(),
    IsNotEmpty(),
    Length(0, 100),
    __metadata("design:type", String)
], CreateJournalModel.prototype, "title", void 0);
__decorate([
    IsOptional(),
    IsString(),
    Length(0, 2000),
    __metadata("design:type", String)
], CreateJournalModel.prototype, "text", void 0);
__decorate([
    IsEnum(CalendarInterval),
    __metadata("design:type", Number)
], CreateJournalModel.prototype, "interval", void 0);
__decorate([
    IsEnum(UserAssignmentStrategy),
    __metadata("design:type", Number)
], CreateJournalModel.prototype, "userStrategy", void 0);
__decorate([
    IsString(),
    IsEnum([
        DataPointValueType.Number,
        DataPointValueType.Text,
        DataPointValueType.Timer,
        DataPointValueType.Selection,
    ]),
    __metadata("design:type", Object)
], CreateJournalModel.prototype, "valueType", void 0);
__decorate([
    Expose(),
    IsEnum(DataPointInputType),
    __metadata("design:type", String)
], CreateJournalModel.prototype, "inputType", void 0);
__decorate([
    IsInt(),
    Min(1),
    ValidateIf((o) => o.type === DataPointValueType.Number),
    __metadata("design:type", Number)
], CreateJournalModel.prototype, "max", void 0);
__decorate([
    IsInt(),
    Lte('max'),
    IsOptional(),
    Min(0),
    ValidateIf((o) => o.type === DataPointValueType.Number),
    __metadata("design:type", Number)
], CreateJournalModel.prototype, "min", void 0);
__decorate([
    IsDefined(),
    MaxLength(250, {
        each: true,
    }),
    IsString({ each: true }),
    ValidateIf((o) => o.type === DataPointValueType.Selection),
    __metadata("design:type", Array)
], CreateJournalModel.prototype, "options", void 0);
__decorate([
    IsBoolean(),
    IsOptional(),
    ValidateIf((o) => o.type === DataPointValueType.Selection),
    __metadata("design:type", Boolean)
], CreateJournalModel.prototype, "allowOther", void 0);
__decorate([
    IsInt(),
    Gte('min'),
    Lte('max'),
    Min(0),
    ValidateIf((o) => o.type === DataPointValueType.Number),
    __metadata("design:type", Number)
], CreateJournalModel.prototype, "optimal", void 0);
__decorate([
    IsBoolean(),
    IsOptional(),
    ValidateIf((o) => o.type === DataPointValueType.Text),
    __metadata("design:type", Boolean)
], CreateJournalModel.prototype, "required", void 0);
__decorate([
    IsArray(),
    MaxLength(20, { each: true }),
    IsOptional(),
    __metadata("design:type", Array)
], CreateJournalModel.prototype, "tagNames", void 0);
CreateJournalModel = __decorate([
    Expose()
], CreateJournalModel);
export { CreateJournalModel };

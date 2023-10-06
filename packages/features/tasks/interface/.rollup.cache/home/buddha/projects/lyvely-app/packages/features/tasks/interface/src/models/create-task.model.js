import { __decorate, __metadata } from "tslib";
import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, IsString, Length, IsEnum, IsOptional, IsInt, Max, Min, IsArray, MaxLength, } from 'class-validator';
import { CalendarInterval } from '@lyvely/dates';
import { UserAssignmentStrategy } from '@lyvely/common';
import { CreateContentModel } from '@lyvely/content-interface';
let CreateTaskModel = class CreateTaskModel extends CreateContentModel {
    constructor(obj, init = true) {
        obj = init
            ? Object.assign({
                interval: CalendarInterval.Daily,
                score: 2,
                userStrategy: UserAssignmentStrategy.Shared,
                tagNames: [],
            }, obj || {})
            : obj;
        super(obj);
    }
};
__decorate([
    Expose(),
    IsString(),
    IsNotEmpty(),
    Length(0, 100),
    __metadata("design:type", String)
], CreateTaskModel.prototype, "title", void 0);
__decorate([
    Expose(),
    IsOptional(),
    IsString(),
    Length(0, 2000),
    __metadata("design:type", String)
], CreateTaskModel.prototype, "text", void 0);
__decorate([
    Expose(),
    IsEnum(CalendarInterval),
    __metadata("design:type", Number)
], CreateTaskModel.prototype, "interval", void 0);
__decorate([
    Expose(),
    IsEnum(UserAssignmentStrategy),
    __metadata("design:type", Number)
], CreateTaskModel.prototype, "userStrategy", void 0);
__decorate([
    Expose(),
    IsInt(),
    Max(100),
    Min(-100),
    __metadata("design:type", Number)
], CreateTaskModel.prototype, "score", void 0);
__decorate([
    Expose(),
    IsArray(),
    MaxLength(20, { each: true }),
    IsOptional(),
    __metadata("design:type", Array)
], CreateTaskModel.prototype, "tagNames", void 0);
CreateTaskModel = __decorate([
    Exclude(),
    __metadata("design:paramtypes", [Object, Object])
], CreateTaskModel);
export { CreateTaskModel };

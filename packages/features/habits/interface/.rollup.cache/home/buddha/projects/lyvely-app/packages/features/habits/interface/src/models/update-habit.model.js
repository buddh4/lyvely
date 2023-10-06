import { __decorate, __metadata } from "tslib";
import { Exclude } from 'class-transformer';
import { PartialType } from '@buddh4/mapped-types';
import { CreateHabitModel } from './create-habit.model';
let UpdateHabitModel = class UpdateHabitModel extends PartialType(CreateHabitModel) {
    constructor(model) {
        super(model, false);
    }
};
UpdateHabitModel = __decorate([
    Exclude(),
    __metadata("design:paramtypes", [Object])
], UpdateHabitModel);
export { UpdateHabitModel };

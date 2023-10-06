import { __decorate, __metadata } from "tslib";
import { Exclude } from 'class-transformer';
import { PartialType } from '@buddh4/mapped-types';
import { CreateTaskModel } from './create-task.model';
let UpdateTaskModel = class UpdateTaskModel extends PartialType(CreateTaskModel) {
    constructor(model) {
        super(model, false);
    }
};
UpdateTaskModel = __decorate([
    Exclude(),
    __metadata("design:paramtypes", [Object])
], UpdateTaskModel);
export { UpdateTaskModel };

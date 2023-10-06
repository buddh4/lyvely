import { __decorate, __metadata } from "tslib";
import { Exclude, Expose, Type } from 'class-transformer';
import { TagModel } from '@lyvely/profiles-interface';
import { PropertyType } from '@lyvely/common';
import { TaskModel } from './task.model';
import { ContentUpdateResponse } from '@lyvely/content-interface';
let UpdateTaskResponse = class UpdateTaskResponse extends ContentUpdateResponse {
};
__decorate([
    Expose(),
    Type(() => TaskModel),
    PropertyType(TaskModel),
    __metadata("design:type", TaskModel)
], UpdateTaskResponse.prototype, "model", void 0);
__decorate([
    Expose(),
    Type(() => TagModel),
    __metadata("design:type", Array)
], UpdateTaskResponse.prototype, "tags", void 0);
UpdateTaskResponse = __decorate([
    Exclude()
], UpdateTaskResponse);
export { UpdateTaskResponse };

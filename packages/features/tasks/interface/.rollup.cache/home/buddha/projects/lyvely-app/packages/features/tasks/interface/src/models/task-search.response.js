import { __decorate, __metadata } from "tslib";
import { Exclude, Type, Expose } from 'class-transformer';
import { TaskModel } from './task.model';
import { BaseModel } from '@lyvely/common';
let TaskSearchResponse = class TaskSearchResponse extends BaseModel {
};
__decorate([
    Expose(),
    Type(() => TaskModel),
    __metadata("design:type", Array)
], TaskSearchResponse.prototype, "models", void 0);
TaskSearchResponse = __decorate([
    Exclude()
], TaskSearchResponse);
export { TaskSearchResponse };

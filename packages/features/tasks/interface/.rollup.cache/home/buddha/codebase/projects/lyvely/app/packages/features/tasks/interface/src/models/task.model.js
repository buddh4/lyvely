var TaskModel_1;
import { __decorate, __metadata } from "tslib";
import { Exclude, Expose } from 'class-transformer';
import { PropertyType, TransformTo } from '@lyvely/common';
import { TimerModel } from '@lyvely/timers-interface';
import { UpdateTaskModel } from './update-task.model';
import { ContentModel } from '@lyvely/content-interface';
let TaskModel = TaskModel_1 = class TaskModel extends ContentModel {
    constructor() {
        super(...arguments);
        this.type = TaskModel_1.contentType;
    }
    get interval() {
        return this.config.interval;
    }
    set interval(interval) {
        this.config.interval = interval;
    }
    toEditModel() {
        return new UpdateTaskModel({
            title: this.content.title,
            text: this.content.text,
            interval: this.config.interval,
            userStrategy: this.config.userStrategy,
            score: this.config.score,
        });
    }
};
TaskModel.contentType = 'Task';
__decorate([
    Expose(),
    __metadata("design:type", Object)
], TaskModel.prototype, "type", void 0);
__decorate([
    Expose(),
    __metadata("design:type", String)
], TaskModel.prototype, "done", void 0);
__decorate([
    Expose(),
    TransformTo(TimerModel),
    PropertyType(TimerModel),
    __metadata("design:type", TimerModel)
], TaskModel.prototype, "timer", void 0);
TaskModel = TaskModel_1 = __decorate([
    Exclude()
], TaskModel);
export { TaskModel };
let UserDoneModel = class UserDoneModel {
};
UserDoneModel = __decorate([
    Expose()
], UserDoneModel);
export { UserDoneModel };
let TaskWithUsersModel = class TaskWithUsersModel extends ContentModel {
    constructor() {
        super(...arguments);
        this.type = TaskModel.contentType;
    }
};
__decorate([
    Expose(),
    TransformTo(UserDoneModel),
    PropertyType([UserDoneModel]),
    __metadata("design:type", Array)
], TaskWithUsersModel.prototype, "doneBy", void 0);
__decorate([
    Expose(),
    TransformTo(TaskModel),
    PropertyType([TaskModel]),
    __metadata("design:type", Array)
], TaskWithUsersModel.prototype, "timers", void 0);
__decorate([
    Expose(),
    __metadata("design:type", Object)
], TaskWithUsersModel.prototype, "type", void 0);
TaskWithUsersModel = __decorate([
    Exclude()
], TaskWithUsersModel);
export { TaskWithUsersModel };
export function isTask(content) {
    return content.type === TaskModel.contentType;
}

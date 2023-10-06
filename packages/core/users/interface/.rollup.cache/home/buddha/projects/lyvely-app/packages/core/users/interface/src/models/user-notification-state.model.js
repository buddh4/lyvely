import { __decorate, __metadata } from "tslib";
import { Exclude, Expose } from 'class-transformer';
import { BaseModel, PropertyType } from '@lyvely/common';
let UserNotificationStateModel = class UserNotificationStateModel extends BaseModel {
};
__decorate([
    Expose(),
    PropertyType(Boolean, { default: false }),
    __metadata("design:type", Boolean)
], UserNotificationStateModel.prototype, "updatesAvailable", void 0);
UserNotificationStateModel = __decorate([
    Exclude()
], UserNotificationStateModel);
export { UserNotificationStateModel };

import { __decorate, __metadata } from "tslib";
import { Expose, Type } from 'class-transformer';
import { BaseModel, UrlRoute } from '@lyvely/common';
import { ProfileInfoModel } from '@lyvely/profiles-interface';
import { UserInfoModel } from '@lyvely/users-interface';
let WebNotification = class WebNotification extends BaseModel {
};
__decorate([
    Type(() => UrlRoute),
    __metadata("design:type", UrlRoute)
], WebNotification.prototype, "route", void 0);
__decorate([
    Type(() => ProfileInfoModel),
    __metadata("design:type", ProfileInfoModel)
], WebNotification.prototype, "profileInfo", void 0);
__decorate([
    Type(() => UserInfoModel),
    __metadata("design:type", UserInfoModel)
], WebNotification.prototype, "userInfo", void 0);
WebNotification = __decorate([
    Expose()
], WebNotification);
export { WebNotification };

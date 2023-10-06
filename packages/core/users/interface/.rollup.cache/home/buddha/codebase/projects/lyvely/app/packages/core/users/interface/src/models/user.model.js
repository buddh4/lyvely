import { __decorate, __metadata } from "tslib";
import { BaseModel, DocumentModel, PropertyType } from '@lyvely/common';
import { AvatarModel } from '@lyvely/avatars-interface';
import { Exclude, Expose, Type } from 'class-transformer';
import { UserNotificationStateModel } from './user-notification-state.model';
let UserEmailModel = class UserEmailModel extends BaseModel {
};
__decorate([
    Expose(),
    __metadata("design:type", String)
], UserEmailModel.prototype, "email", void 0);
__decorate([
    Expose(),
    __metadata("design:type", Boolean)
], UserEmailModel.prototype, "verified", void 0);
UserEmailModel = __decorate([
    Exclude()
], UserEmailModel);
export { UserEmailModel };
let UserInfoModel = class UserInfoModel extends BaseModel {
};
UserInfoModel = __decorate([
    Expose()
], UserInfoModel);
export { UserInfoModel };
let UserModel = class UserModel extends DocumentModel {
    findEmail(email) {
        return this.emails.find((userEmail) => userEmail.email.toLowerCase() === email);
    }
};
__decorate([
    Expose(),
    __metadata("design:type", String)
], UserModel.prototype, "id", void 0);
__decorate([
    Expose(),
    __metadata("design:type", Number)
], UserModel.prototype, "status", void 0);
__decorate([
    Expose(),
    __metadata("design:type", String)
], UserModel.prototype, "username", void 0);
__decorate([
    Expose(),
    __metadata("design:type", String)
], UserModel.prototype, "email", void 0);
__decorate([
    Expose(),
    PropertyType(Date),
    __metadata("design:type", Date)
], UserModel.prototype, "createdAt", void 0);
__decorate([
    Expose(),
    __metadata("design:type", String)
], UserModel.prototype, "guid", void 0);
__decorate([
    Expose(),
    Type(() => AvatarModel),
    __metadata("design:type", AvatarModel)
], UserModel.prototype, "avatar", void 0);
__decorate([
    Expose(),
    __metadata("design:type", String)
], UserModel.prototype, "locale", void 0);
__decorate([
    Expose(),
    Type(() => UserEmailModel),
    PropertyType([UserEmailModel]),
    __metadata("design:type", Array)
], UserModel.prototype, "emails", void 0);
__decorate([
    Expose(),
    Type(() => UserNotificationStateModel),
    PropertyType(UserNotificationStateModel),
    __metadata("design:type", UserNotificationStateModel)
], UserModel.prototype, "notification", void 0);
UserModel = __decorate([
    Exclude()
], UserModel);
export { UserModel };
export var UserStatus;
(function (UserStatus) {
    UserStatus[UserStatus["Disabled"] = 0] = "Disabled";
    UserStatus[UserStatus["Active"] = 1] = "Active";
    UserStatus[UserStatus["EmailVerification"] = 2] = "EmailVerification";
    UserStatus[UserStatus["Locked"] = 3] = "Locked";
})(UserStatus || (UserStatus = {}));

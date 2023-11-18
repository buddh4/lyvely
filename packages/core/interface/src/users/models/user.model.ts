import { BaseModel, DocumentModel, PropertyType } from '@lyvely/common';
import { AvatarModel } from '@/avatars';
import { Exclude, Expose } from 'class-transformer';
import { UserNotificationStateModel } from './user-notification-state.model';

@Exclude()
export class UserEmailModel extends BaseModel<UserEmailModel> {
  @Expose()
  email: string;

  @Expose()
  verified: boolean;
}

@Expose()
export class UserInfoModel extends BaseModel<UserInfoModel> {
  uid: string;
  imageGuid?: string;
  name: string;
}

@Exclude()
export class UserModel extends DocumentModel<UserModel> {
  @Expose()
  id: string;

  @Expose()
  status: UserStatus;

  @Expose()
  username: string;

  @Expose()
  email: string;

  @Expose()
  @PropertyType(Date)
  createdAt: Date;

  @Expose()
  guid: string;

  @Expose()
  @PropertyType(AvatarModel, { optional: true })
  avatar?: AvatarModel;

  @Expose()
  locale: string;

  @Expose()
  timezone: string;

  @Expose()
  settings: Record<string, any>;

  // TODO: This should not be part of the main user model, but rather accessible by extra endpoint.
  @Expose()
  @PropertyType([UserEmailModel])
  emails: UserEmailModel[];

  @Expose()
  @PropertyType(UserNotificationStateModel)
  notification: UserNotificationStateModel;

  findEmail(email: string) {
    return this.emails.find((userEmail) => userEmail.email.toLowerCase() === email);
  }
}

export enum UserStatus {
  Disabled, // Manually disabled by system or admin
  Active, // Active state, after successful registration
  EmailVerification, // Email verification required
  Locked, // User is temporarily locked
}

import {
  BaseModel,
  type PropertiesOf,
  PropertyType,
  TransformObjectId,
  TransformObjectIds,
} from '@lyvely/common';
import { AvatarModel } from '@/avatars';
import { Exclude, Expose } from 'class-transformer';
import { UserNotificationStateModel } from './user-notification-state.model';
import { UserRelationRole, UserStatus } from '../interfaces';
import { IPermissionObject, UserRole, IPermissionSetting } from '@/permissions/interfaces';

@Exclude()
export class UserEmailModel {
  @Expose()
  email: string;

  @Expose()
  verified: boolean;

  constructor(data: PropertiesOf<UserEmailModel>) {
    BaseModel.init(this, data);
  }
}

@Exclude()
export class UserInfoModel<TID = string> {
  @Expose()
  @TransformObjectId()
  uid: TID;

  @Expose()
  imageGuid?: string;

  @Expose()
  name: string;

  constructor(data: PropertiesOf<UserInfoModel<any>>) {
    BaseModel.init(this, data);
  }
}

@Exclude()
export class UserPermissionSetting<TID = string>
  implements IPermissionSetting<TID, UserRelationRole>
{
  @Expose()
  id: string;

  @Expose()
  role: UserRelationRole;

  @Expose()
  @TransformObjectIds()
  groups?: TID[];

  constructor(data: PropertiesOf<UserPermissionSetting<any>>) {
    BaseModel.init(this, data);
  }
}

@Expose()
export class UserRelationGroupModel {
  @Expose()
  id: string;
  @Expose()
  name: string;
  @Expose()
  description?: string;

  constructor(data: PropertiesOf<UserRelationGroupModel>) {
    BaseModel.init(this, data);
  }
}

@Exclude()
export class UserModel<TID = string> implements IPermissionObject<UserRelationRole> {
  @Expose()
  id: string;

  @Expose()
  status: UserStatus;

  @Expose()
  role: UserRole;

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

  @Expose()
  @PropertyType([UserPermissionSetting])
  permissions: UserPermissionSetting<TID>[];

  @Expose()
  @PropertyType([UserRelationGroupModel])
  groups: UserRelationGroupModel[];

  constructor(data: Partial<UserModel<any>>) {
    BaseModel.init(this, data);
  }

  getPermissionSettings(): IPermissionSetting<any, UserRelationRole>[] {
    return this.permissions;
  }

  getPermissionGroups(): string[] {
    return this.groups.map((g) => g.id);
  }

  findEmail(email: string) {
    return this.emails.find((userEmail) => userEmail.email.toLowerCase() === email);
  }
}

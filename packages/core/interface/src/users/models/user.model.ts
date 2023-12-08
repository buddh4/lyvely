import { BaseModel, DocumentModel, PropertyType } from '@lyvely/common';
import { AvatarModel } from '@/avatars';
import { Exclude, Expose } from 'class-transformer';
import { UserNotificationStateModel } from './user-notification-state.model';
import { UserRelationRole, UserStatus } from '../interfaces';
import {
  GlobalPermissionRole,
  IPermissionObject,
  IPermissionSetting,
} from '@/permissions/interfaces';

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

@Expose()
export class UserPermissionSetting<TID = string>
  implements IPermissionSetting<TID, UserRelationRole>
{
  id: string;
  role: UserRelationRole;
  groups?: TID[];
}

@Expose()
export class UserRelationGroupModel {
  id: string;
  name: string;
  description?: string;
}

@Exclude()
export class UserModel<TID = string>
  extends DocumentModel<UserModel<any>>
  implements IPermissionObject<UserRelationRole>
{
  @Expose()
  id: string;

  @Expose()
  status: UserStatus;

  @Expose()
  role: GlobalPermissionRole;

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

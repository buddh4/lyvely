import { Exclude, Expose } from 'class-transformer';
import { BaseModel, DocumentModel, TransformObjectId, PropertyType } from '@lyvely/common';
import { ProfileType, ProfileRelationRole, ProfileUsage } from '../interfaces';
import { IPermissionObject, IPermissionSetting } from '@/permissions';
import { TagModel } from './tag.model';

@Expose()
export class ProfileInfoModel extends BaseModel<ProfileInfoModel> {
  pid: string;
  imageGuid?: string;
  name: string;
}

@Expose()
export class ProfilePermissionSettingModel<TID = string>
  implements IPermissionSetting<TID, ProfileRelationRole>
{
  id: string;
  role: ProfileRelationRole;
  groups?: TID[];
}

@Expose()
export class ProfileMemberGroupModel {
  id: string;
  name: string;
  description?: string;
}

@Exclude()
export class ProfileModel<TID = string>
  extends DocumentModel<ProfileModel<TID>>
  implements IPermissionObject<ProfileRelationRole>
{
  @Expose()
  subscription?: string;

  @TransformObjectId()
  @Expose()
  oid: TID;

  @Expose()
  name: string;

  @Expose()
  handle: string;

  @Expose()
  hasOrg: boolean;

  @Expose()
  description?: string;

  @Expose()
  score: number;

  @Expose()
  type: ProfileType;

  @Expose()
  @PropertyType([String])
  enabledFeatures: string[];

  @Expose()
  usage: ProfileUsage[];

  @Expose()
  @PropertyType([String])
  disabledFeatures: string[];

  @Expose()
  settings: Record<string, any>;

  @Expose()
  @PropertyType([ProfilePermissionSettingModel<TID>])
  permissions: ProfilePermissionSettingModel<TID>[];

  @Expose()
  @PropertyType([ProfileMemberGroupModel])
  groups: ProfileMemberGroupModel[];

  @Expose()
  visibility: number;

  @Expose()
  locale: string;

  @Expose()
  guid?: string;

  @Expose()
  @PropertyType([TagModel])
  tags: TagModel[];

  getPermissionSettings(): IPermissionSetting<any, ProfileRelationRole>[] {
    return this.permissions || [];
  }

  getPermissionGroups(): string[] {
    return this.groups.map((g) => g.id);
  }
}

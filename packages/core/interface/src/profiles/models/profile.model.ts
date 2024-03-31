import { Exclude, Expose } from 'class-transformer';
import { BaseModel, TransformObjectId, PropertyType } from '@lyvely/common';
import type { PartialPropertiesOf } from '@lyvely/common';
import {
  ProfileType,
  ProfileUsage,
  ProfileVisibilityLevel,
  IProfilePermissionData,
  IProfilePermissionObject,
} from '../interfaces';
import { ProfilePermissionSettingModel } from './profile-permission-settings.model';
import { IPermissionSetting } from '@/permissions';
import { TagModel } from './tag.model';

@Expose()
export class ProfileInfoModel {
  pid: string;
  imageGuid?: string;
  name: string;

  constructor(data: ProfileInfoModel) {
    this.pid = data.pid;
    this.imageGuid = data.imageGuid;
    this.name = data.name;
  }
}

@Expose()
export class ProfileMemberGroupModel {
  id: string;
  name: string;
  description?: string;
}

@Exclude()
export class ProfileModel<TID = string> implements IProfilePermissionObject {
  @Expose()
  id: string;

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
  visibility: ProfileVisibilityLevel;

  @Expose()
  locale: string;

  @Expose()
  guid?: string;

  @Expose()
  @PropertyType([TagModel])
  tags: TagModel[];

  constructor(data: PartialPropertiesOf<ProfileModel<any>>) {
    BaseModel.init(this, data);
  }

  /**
   * Retrieves the permission settings for this profile.
   *
   * @returns {Array<IPermissionSetting<any, ProfileRelationRole | ContentUserRole>>} The permission settings.
   */
  getPermissionSettings(): IPermissionSetting[] {
    return (this.permissions as IPermissionSetting[]) || [];
  }

  /**
   * Retrieves an array of permission group IDs of this profile.
   *
   * @return {string[]} An array of permission group IDs.
   */
  getPermissionGroups(): string[] {
    return this.groups.map((g) => g.id);
  }

  /**
   * Retrieves the profile visibility level.
   *
   * @return {ProfileVisibilityLevel} The profile visibility level.
   */
  getProfilePermissionData(): IProfilePermissionData {
    return this;
  }
}

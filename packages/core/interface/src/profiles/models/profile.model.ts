import { Exclude, Expose, Type } from 'class-transformer';
import { BaseModel, DocumentModel, TransformObjectId, PropertyType } from '@lyvely/common';
import { ProfileType, ProfileRelationRole } from '../interfaces';
import { IPermissionSetting } from '@/permissions';
import { TagModel } from './tag.model';

@Expose()
export class ProfileInfoModel extends BaseModel<ProfileInfoModel> {
  pid: string;
  imageGuid?: string;
  name: string;
}

@Expose()
export class ProfilePermissionSetting implements IPermissionSetting {
  id: string;
  role: ProfileRelationRole;
}

@Exclude()
export class ProfileModel<TID = string> extends DocumentModel<ProfileModel<TID>> {
  @Expose()
  subscription?: string;

  @TransformObjectId()
  @Expose()
  oid: TID;

  @Expose()
  name: string;

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
  @PropertyType([String])
  disabledFeatures: string[];

  @Expose()
  @PropertyType([ProfilePermissionSetting])
  permissions: ProfilePermissionSetting[];

  @Expose()
  visibility: number;

  @Expose()
  locale: string;

  @Expose()
  guid?: string;

  @Expose()
  @Type(() => TagModel)
  tags: TagModel[];
}

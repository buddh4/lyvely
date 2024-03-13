import { Exclude, Expose } from 'class-transformer';
import {
  BaseModel,
  type BaseModelData,
  type PropertiesOf,
  PropertyType,
  TransformObjectId,
} from '@lyvely/common';
import { IProfileRelation, IProfileRelationUserInfo } from '../interfaces';
import { UserStatus } from '@/users';

@Exclude()
export class ProfileRelationUserInfoModel implements IProfileRelationUserInfo {
  @Expose()
  displayName: string;

  @Expose()
  description?: string;

  @Exclude()
  email?: string;

  @Expose()
  guid?: string;

  constructor(data: PropertiesOf<ProfileRelationUserInfoModel>) {
    BaseModel.init(this, data);
  }
}

@Exclude()
export class ProfileRelationModel<TID = string> implements IProfileRelation<TID> {
  @Expose()
  id: string;

  @Expose()
  @TransformObjectId()
  oid: TID;

  @Expose()
  @TransformObjectId()
  pid: TID;

  @Expose()
  @TransformObjectId()
  uid: TID;

  @Expose()
  type: string;

  @Expose()
  role?: string;

  @Expose()
  @PropertyType(ProfileRelationUserInfoModel)
  userInfo: ProfileRelationUserInfoModel;

  @Expose()
  relationStatus: UserStatus;

  constructor(data: BaseModelData<ProfileRelationModel<any>>) {
    BaseModel.init(this, data);
  }
}

@Exclude()
export class ProfileRelationDetailsModel<TID = string> extends ProfileRelationModel<TID> {}

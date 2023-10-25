import { Exclude, Expose, Type } from 'class-transformer';
import { BaseModel, TransformObjectId } from '@lyvely/common';
import { IProfileRelation, IProfileRelationUserInfo } from '../interfaces';
import { UserStatus } from '@/users';

@Exclude()
export class ProfileRelationUserInfoModel
  extends BaseModel<ProfileRelationUserInfoModel>
  implements IProfileRelationUserInfo
{
  @Expose()
  displayName: string;

  @Expose()
  description?: string;

  @Exclude()
  email?: string;

  @Expose()
  guid?: string;
}

@Exclude()
export class ProfileRelationModel<
    TID = string,
    T extends IProfileRelation<TID> = IProfileRelation<TID>,
  >
  extends BaseModel<T & { pid: TID; oid: TID; uid: TID }>
  implements IProfileRelation<TID>
{
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
  @Type(() => ProfileRelationUserInfoModel)
  userInfo: ProfileRelationUserInfoModel;

  @Expose()
  relationStatus: UserStatus;

  @Expose()
  role?: string;
}

@Exclude()
export class ProfileRelationDetailsModel<
  TID = string,
  T extends IProfileRelation<TID> = IProfileRelation<TID>,
> extends ProfileRelationModel<TID, T> {}

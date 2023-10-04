import { Exclude, Expose, Type } from 'class-transformer';
import { BaseModel, TransformObjectId } from '@lyvely/common';
import { IProfileRelation, IProfileRelationUserInfo } from '../interfaces';

@Exclude()
export class ProfileRelationUserInfoDto implements IProfileRelationUserInfo {
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
export class ProfileRelationModel<T extends IProfileRelation = IProfileRelation>
  extends BaseModel<T & { pid: any; oid: any; uid: any }>
  implements IProfileRelation
{
  @Expose()
  id: string;

  @Expose()
  @TransformObjectId()
  oid: any;

  @Expose()
  @TransformObjectId()
  pid: any;

  @Expose()
  @TransformObjectId()
  uid: any;

  @Expose()
  type: string;

  @Expose()
  @Type(() => ProfileRelationUserInfoDto)
  userInfo: ProfileRelationUserInfoDto;

  @Expose()
  role?: string;
}

@Exclude()
export class ProfileRelationDetailsModel<
  T extends IProfileRelation = IProfileRelation,
> extends ProfileRelationModel<T> {}

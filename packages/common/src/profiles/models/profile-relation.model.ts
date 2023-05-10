import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { BaseModel } from '@/models';
import { IProfileRelation, IProfileRelationUserInfo } from '../interfaces';
import { TransformObjectId } from '@/utils';

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
  oid: TObjectId;

  @Expose()
  @TransformObjectId()
  pid: TObjectId;

  @Expose()
  @TransformObjectId()
  uid: TObjectId;

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

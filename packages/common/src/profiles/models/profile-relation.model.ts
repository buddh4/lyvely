import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { BaseModel } from '@/models';
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
  @Transform(({ value, obj }) => obj.oid?.toString() || value)
  oid: TObjectId;

  @Expose()
  @Transform(({ value, obj }) => obj.pid?.toString() || value)
  pid: TObjectId;

  @Expose()
  @Transform(({ value, obj }) => obj.uid?.toString() || value)
  uid: TObjectId;

  @Expose()
  type: string;

  @Expose()
  @Type(() => ProfileRelationUserInfoDto)
  userInfo: ProfileRelationUserInfoDto;

  @Expose()
  role?: string;
}

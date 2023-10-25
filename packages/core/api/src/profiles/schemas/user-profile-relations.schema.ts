import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { assignEntityData, BaseEntity, assureObjectId, TObjectId, ObjectIdProp } from '@/core';
import { Profile } from './profiles.schema';
import { User } from '@/users';
import { getNumberEnumValues, PropertyType, validateEmail } from '@lyvely/common';
import { IProfileRelationUserInfo, UserStatus, ProfileRelationModel } from '@lyvely/core-interface';

export interface ICreateProfileRelation {
  profile: Profile;
  user: User;
  type?: string; // Usually given by sub types
  displayName?: string;
  guid?: string;
  email?: string;
  description?: string;
  role: string;
}

@Schema({ _id: false })
export class ProfileRelationUserInfo implements IProfileRelationUserInfo {
  @Prop({ required: true, type: String })
  displayName: string;

  @Prop({ required: true, validate: { validator: validateEmail } })
  email: string;

  @Prop({ type: String })
  guid: string;

  @Prop()
  description?: string;

  constructor(obj?: Partial<ProfileRelationUserInfo>) {
    assignEntityData(this, obj);
  }

  static create(data: ICreateProfileRelation) {
    return new ProfileRelationUserInfo({
      displayName: data.displayName || data.user.username,
      email: data.email || data.user.email,
      guid: data.guid || data.user.guid,
      description: data.description,
    });
  }
}

export const UserProfileRelationInfoSchema = SchemaFactory.createForClass(ProfileRelationUserInfo);

type UserRelation = {
  _id: TObjectId;
  uid: TObjectId;
  oid: TObjectId;
  pid: TObjectId;
  userInfo: ProfileRelationUserInfo;
  type: string;
  role: string;
};

/**
 * TODO: also include oid? Only problematic if we move a profile from one orga to another...
 */
@Schema({ timestamps: true, discriminatorKey: 'type' })
export class UserProfileRelation<C extends UserRelation = UserRelation>
  extends BaseEntity<C>
  implements ProfileRelationModel<TObjectId>
{
  @ObjectIdProp({ required: true })
  uid: TObjectId;

  @ObjectIdProp({ required: true })
  oid: TObjectId;

  @ObjectIdProp({ required: true })
  pid: TObjectId;

  @Prop({ type: UserProfileRelationInfoSchema })
  @PropertyType(ProfileRelationUserInfo)
  userInfo: ProfileRelationUserInfo;

  @PropertyType(Number, { default: UserStatus.Active })
  @Prop({ enum: getNumberEnumValues(UserStatus), required: true })
  relationStatus: UserStatus;

  type: string;

  @Prop({ type: String })
  role?: string;

  createdAt: Date;

  updatedAt: Date;

  static create(data: ICreateProfileRelation & any): UserProfileRelation {
    return new UserProfileRelation({
      uid: assureObjectId(data.user),
      pid: assureObjectId(data.profile),
      oid: assureObjectId(data.profile.oid),
      userInfo: ProfileRelationUserInfo.create(data),
      type: data.type,
      role: data.role,
    });
  }
}

export const UserProfileRelationSchema = SchemaFactory.createForClass(UserProfileRelation);

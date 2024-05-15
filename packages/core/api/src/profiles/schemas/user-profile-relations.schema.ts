import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  BaseDocument,
  assureObjectId,
  TObjectId,
  ObjectIdProp,
  type BaseDocumentData,
  NestedSchema,
} from '@/core';
import { Profile } from './profiles.schema';
import { User } from '@/users';
import {
  BaseModel,
  getNumberEnumValues,
  PropertyType,
  type StrictBaseModelData,
  validateEmail,
} from '@lyvely/common';
import { IProfileRelationUserInfo, UserStatus, ProfileRelationModel } from '@lyvely/interface';

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

@NestedSchema()
export class ProfileRelationUserInfo implements IProfileRelationUserInfo {
  @Prop({ required: true })
  displayName: string;

  @Prop({ required: true, validate: { validator: validateEmail } })
  email: string;

  @Prop()
  guid: string;

  @Prop()
  description?: string;

  constructor(data: StrictBaseModelData<ProfileRelationUserInfo>) {
    BaseModel.init(this, data);
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

@Schema({ timestamps: true, discriminatorKey: 'type' })
export class UserProfileRelation implements ProfileRelationModel<TObjectId> {
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

  role?: string;

  createdAt: Date;

  updatedAt: Date;

  id: string;

  _id: TObjectId;

  constructor(data: BaseDocumentData<UserProfileRelation>) {
    BaseDocument.init(this, data);
  }

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

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { assignEntityData, BaseEntity, validateEmail, assureObjectId } from '@/core';
import { Profile } from './profiles.schema';
import { User } from '../../users';
import { IProfileRelationUserInfo, ProfileRelationUserInfoDto } from '@lyvely/common';

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
export class UserProfileRelation<C extends UserRelation = UserRelation> extends BaseEntity<C> {
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  uid: TObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  oid: TObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  pid: TObjectId;

  @Prop({ type: UserProfileRelationInfoSchema })
  userInfo: ProfileRelationUserInfo;

  type: string;

  @Prop({ type: String })
  role?: string;

  createdAt: Date;

  updatedAt: Date;

  afterInit() {
    if (!(this.userInfo instanceof ProfileRelationUserInfoDto)) {
      this.userInfo = new ProfileRelationUserInfo(this.userInfo);
    }
    super.afterInit();
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
export type UserProfileRelationDocument = UserProfileRelation & mongoose.Document;

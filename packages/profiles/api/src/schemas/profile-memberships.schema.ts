import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import {
  UserProfileRelation,
  ICreateProfileRelation,
  ProfileRelationUserInfo,
} from './user-profile-relations.schema';
import { assureObjectId } from '@lyvely/core';
import { BaseMembershipRole } from '@lyvely/profiles-interface';

export interface ICreateMembership extends ICreateProfileRelation {
  role: string;
}

export type MembershipDocument = Membership & mongoose.Document;

@Schema({ timestamps: true })
export class Membership extends UserProfileRelation<Membership> {
  @Prop({ required: true, default: BaseMembershipRole.Member })
  role: string;

  static create(data: ICreateMembership): Membership {
    return new Membership({
      uid: assureObjectId(data.user),
      pid: assureObjectId(data.profile),
      oid: assureObjectId(data.profile.oid),
      userInfo: ProfileRelationUserInfo.create(data),
      type: data.type,
      role: data.role,
    });
  }
}

export const MembershipSchema = SchemaFactory.createForClass(Membership);

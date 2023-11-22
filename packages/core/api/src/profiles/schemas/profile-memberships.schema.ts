import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  UserProfileRelation,
  ICreateProfileRelation,
  ProfileRelationUserInfo,
} from './user-profile-relations.schema';
import { assureObjectId } from '@/core';
import { ProfileMembershipRole, BaseUserProfileRelationType } from '@lyvely/interface';

export interface ICreateMembership extends ICreateProfileRelation {
  role: ProfileMembershipRole;
}

@Schema({ timestamps: true })
export class Membership extends UserProfileRelation<Membership> {
  @Prop({ required: true, default: ProfileMembershipRole.Member })
  role: ProfileMembershipRole;

  static create(data: ICreateMembership): Membership {
    return new Membership({
      uid: assureObjectId(data.user),
      pid: assureObjectId(data.profile),
      oid: assureObjectId(data.profile.oid),
      userInfo: ProfileRelationUserInfo.create(data),
      type: BaseUserProfileRelationType.Membership,
      role: data.role,
    });
  }
}

export const MembershipSchema = SchemaFactory.createForClass(Membership);

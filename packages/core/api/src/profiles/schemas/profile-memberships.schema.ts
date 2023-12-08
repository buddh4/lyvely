import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  UserProfileRelation,
  ICreateProfileRelation,
  ProfileRelationUserInfo,
} from './user-profile-relations.schema';
import { assureObjectId, ObjectIdArrayProp, TObjectId } from '@/core';
import {
  ProfileMembershipRole,
  BaseUserProfileRelationType,
  MembershipModel,
} from '@lyvely/interface';
import { getStringEnumValues, PropertyType } from '@lyvely/common';

export interface ICreateMembership extends ICreateProfileRelation {
  role: ProfileMembershipRole;
}

@Schema({ timestamps: true })
export class Membership
  extends UserProfileRelation<Membership>
  implements MembershipModel<TObjectId>
{
  @Prop({
    required: true,
    enum: getStringEnumValues(ProfileMembershipRole),
    default: ProfileMembershipRole.Member,
  })
  @PropertyType(String, { default: ProfileMembershipRole.Member })
  role: ProfileMembershipRole;

  @ObjectIdArrayProp({ default: [] })
  groups: TObjectId[];

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

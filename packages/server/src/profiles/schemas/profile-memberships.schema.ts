import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import {
  BaseMembershipRole,
  UserProfileRelation, CreateProfileRelation
} from './user-profile-relations.schema';
import { assureObjectId } from '../../db/db.utils';

export interface CreateMembership extends CreateProfileRelation {
  role: string
}

export type MembershipDocument = Membership & mongoose.Document;

@Schema({ timestamps: true })
export class Membership extends UserProfileRelation<Membership> {

  @Prop({ required: true, default: BaseMembershipRole.Member })
  role: string;

  static create(data: CreateMembership): Membership {
    return new Membership({
      uid: assureObjectId(data.user),
      pid: assureObjectId(data.profile),
      role: data.role,
    });
  }
}

export const MembershipSchema = SchemaFactory.createForClass(Membership);

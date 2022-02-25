import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { BaseEntity } from '../../db/base.entity';
import { assureObjectId, EntityIdentity } from '../../db/db.utils';
import { Profile } from './profiles.schema';
import { User } from '../../users/schemas/users.schema';

export enum BaseUserProfileRelationType {
  Membership = 'Membership',
}

export enum BaseMembershipRole {
  Owner = 'owner',
  Member = 'member',
  Admin = 'admin',
}

export interface CreateProfileRelation {
  profile: EntityIdentity<Profile>,
  user: EntityIdentity<User>,
  type?: string, // Usually given by sub types
  role: string,
}

type UserRelation = {
  _id: mongoose.Types.ObjectId;
  uid: mongoose.Types.ObjectId;
  pid: mongoose.Types.ObjectId;
  type: string;
  role: string;
}

/**
 * TODO: also include oid? Only problematic if we move a profile from one orga to another...
 */

@Schema({ timestamps: true, discriminatorKey: 'type' })
export class UserProfileRelation<C extends UserRelation = UserRelation> extends BaseEntity<C> {

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  uid: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  pid: mongoose.Types.ObjectId;

  type: string;

  @Prop({ type: String, required: true })
  role: string;

  createdAt: Date;

  updatedAt: Date;

  static create(data: CreateProfileRelation & any): UserProfileRelation {
    return new UserProfileRelation({
      uid: assureObjectId(data.user),
      pid: assureObjectId(data.profile),
      type: data.type,
      role: data.role
    });
  }
}

export const UserProfileRelationSchema = SchemaFactory.createForClass(UserProfileRelation);
export type UserProfileRelationDocument = UserProfileRelation & mongoose.Document;

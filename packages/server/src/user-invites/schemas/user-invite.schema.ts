import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { BaseEntity } from '@/core';
import { BaseProfileRelationRole } from '@lyvely/common';

@Schema({ timestamps: true })
export class UserInvite extends BaseEntity<UserInvite> {
  @Prop({ type: Types.ObjectId, required: true })
  createdBy: TObjectId;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  token: string;

  @Prop({ type: Types.ObjectId })
  pid?: TObjectId;

  @Prop({ enum: [BaseProfileRelationRole.Member, BaseProfileRelationRole.Guest] })
  role?: BaseProfileRelationRole.Member | BaseProfileRelationRole.Guest;

  createdAt: Date;
  updatedAt: Date;
}

export const UserInviteSchema = SchemaFactory.createForClass(UserInvite);

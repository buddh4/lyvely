import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { BaseEntity } from '@/core';
import { BaseProfileRelationRole } from '@lyvely/common';

@Schema({ timestamps: true, discriminatorKey: 'type' })
export class Invitation<T extends Invitation = any> extends BaseEntity<T> {
  @Prop({ type: Types.ObjectId, required: true })
  createdBy: TObjectId;

  type: string;

  @Prop({ required: true })
  token: string;

  @Prop({ type: Types.ObjectId })
  pid?: TObjectId;

  @Prop({ enum: [BaseProfileRelationRole.Member, BaseProfileRelationRole.Guest] })
  role?: BaseProfileRelationRole.Member | BaseProfileRelationRole.Guest;

  createdAt: Date;
  updatedAt: Date;
}

export const InvitationSchema = SchemaFactory.createForClass(Invitation);

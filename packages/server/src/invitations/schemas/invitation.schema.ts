import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseEntity, ObjectIdProp } from '@/core';
import { BaseProfileRelationRole } from '@lyvely/common';

@Schema({ timestamps: true, discriminatorKey: 'type' })
export class Invitation<T extends Invitation = any> extends BaseEntity<T> {
  @ObjectIdProp({ required: true })
  createdBy: TObjectId;

  @ObjectIdProp()
  uid?: TObjectId;

  @ObjectIdProp()
  pid?: TObjectId;

  @Prop()
  token?: string;

  @Prop({ enum: [BaseProfileRelationRole.Member, BaseProfileRelationRole.Guest] })
  role?: BaseProfileRelationRole.Member | BaseProfileRelationRole.Guest;

  type: string;

  createdAt: Date;
  updatedAt: Date;
}

export const InvitationSchema = SchemaFactory.createForClass(Invitation);

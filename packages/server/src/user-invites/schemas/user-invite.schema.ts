import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { BaseEntity } from '@/core';

@Schema({ timestamps: true })
export class UserInvite extends BaseEntity<UserInvite> {
  @Prop()
  createdBy: TObjectId;

  @Prop()
  email: string;

  @Prop()
  token: string;

  @Prop({ type: [Types.ObjectId] })
  pid?: TObjectId;

  createdAt: Date;
  updatedAt: Date;
}

export const UserInviteSchema = SchemaFactory.createForClass(UserInvite);

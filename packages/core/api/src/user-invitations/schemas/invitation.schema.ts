import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseEntity, ObjectIdProp } from '@/core';
import { BaseMembershipRole } from '@lyvely/core-interface';
import { InvitationIF } from '../interfaces';
import { Types } from 'mongoose';

@Schema({ timestamps: true, discriminatorKey: 'type' })
export class Invitation<T extends Invitation = any> extends BaseEntity<T> implements InvitationIF {
  @ObjectIdProp({ required: true })
  createdBy: Types.ObjectId;

  @ObjectIdProp()
  uid?: Types.ObjectId;

  @ObjectIdProp()
  pid?: Types.ObjectId;

  @Prop()
  token?: string;

  @Prop({ enum: [BaseMembershipRole.Member, BaseMembershipRole.Guest] })
  role?: BaseMembershipRole.Member | BaseMembershipRole.Guest;

  type: string;

  createdAt: Date;
  updatedAt: Date;

  afterInit() {
    this.role =
      this.role === BaseMembershipRole.Guest ? BaseMembershipRole.Guest : BaseMembershipRole.Member;
  }
}

export const InvitationSchema = SchemaFactory.createForClass(Invitation);

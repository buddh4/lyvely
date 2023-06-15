import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseEntity, ObjectIdProp } from '@lyvely/server-core';
import { BaseMembershipRole } from '@lyvely/common';
import { InvitationIF } from '../interfaces';

@Schema({ timestamps: true, discriminatorKey: 'type' })
export class Invitation<T extends Invitation = any> extends BaseEntity<T> implements InvitationIF {
  @ObjectIdProp({ required: true })
  createdBy: TObjectId;

  @ObjectIdProp()
  uid?: TObjectId;

  @ObjectIdProp()
  pid?: TObjectId;

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

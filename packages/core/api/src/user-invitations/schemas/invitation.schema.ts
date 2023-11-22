import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseEntity, ObjectIdProp, TObjectId } from '@/core';
import { ProfileMembershipRole } from '@lyvely/interface';
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

  @Prop({ enum: [ProfileMembershipRole.Member, ProfileMembershipRole.Guest] })
  role?: ProfileMembershipRole.Member | ProfileMembershipRole.Guest;

  type: string;

  createdAt: Date;
  updatedAt: Date;

  afterInit() {
    this.role =
      this.role === ProfileMembershipRole.Guest
        ? ProfileMembershipRole.Guest
        : ProfileMembershipRole.Member;
  }
}

export const InvitationSchema = SchemaFactory.createForClass(Invitation);

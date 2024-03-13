import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseDocument, ObjectIdProp, TObjectId } from '@/core';
import { ProfileMembershipRole } from '@lyvely/interface';
import { InvitationIF } from '../interfaces';
import type { BaseModelData } from '@lyvely/common';

@Schema({ timestamps: true, discriminatorKey: 'type' })
export class Invitation implements InvitationIF {
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

  id: string;
  _id: TObjectId;

  constructor(data: BaseModelData<Invitation>) {
    BaseDocument.init(this, data);
  }

  afterInit() {
    this.role =
      this.role === ProfileMembershipRole.Guest
        ? ProfileMembershipRole.Guest
        : ProfileMembershipRole.Member;
  }
}

export const InvitationSchema = SchemaFactory.createForClass(Invitation);

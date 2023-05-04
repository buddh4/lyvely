import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Invitation } from './invitation.schema';
import { ObjectIdProp } from '@/core';

@Schema({ timestamps: true })
export class UserInvitation extends Invitation<UserInvitation> {
  @ObjectIdProp({ required: true })
  uid: TObjectId;

  @ObjectIdProp({ required: true })
  pid: TObjectId;

  type = UserInvitation.name;
}

export const UserInvitationSchema = SchemaFactory.createForClass(UserInvitation);

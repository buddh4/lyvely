import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Invitation } from './invitation.schema';
import { ObjectIdProp, TObjectId } from '@/core';
import { IUserInvitation } from '../interfaces';

@Schema({ timestamps: true })
export class UserInvitation extends Invitation<UserInvitation> implements IUserInvitation {
  @ObjectIdProp({ required: true })
  uid: TObjectId;

  @ObjectIdProp({ required: true })
  pid: TObjectId;

  type = UserInvitation.name;
}

export const UserInvitationSchema = SchemaFactory.createForClass(UserInvitation);

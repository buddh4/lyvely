import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Invitation } from './invitation.schema';
import { ObjectIdProp, TObjectId } from '@/core';
import { IUserInvitation } from '../interfaces';

@Schema({ timestamps: true })
export class UserInvitation extends Invitation implements IUserInvitation {
  @ObjectIdProp({ required: true })
  override uid: TObjectId;

  @ObjectIdProp({ required: true })
  override pid: TObjectId;

  override type = UserInvitation.name;
}

export const UserInvitationSchema = SchemaFactory.createForClass(UserInvitation);

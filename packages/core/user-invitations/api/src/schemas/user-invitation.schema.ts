import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Invitation } from './invitation.schema';
import { ObjectIdProp } from '@lyvely/core';
import { IUserInvitation } from '../interfaces';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class UserInvitation extends Invitation<UserInvitation> implements IUserInvitation {
  @ObjectIdProp({ required: true })
  uid: Types.ObjectId;

  @ObjectIdProp({ required: true })
  pid: Types.ObjectId;

  type = UserInvitation.name;
}

export const UserInvitationSchema = SchemaFactory.createForClass(UserInvitation);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Invitation } from './invitation.schema';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class UserInvitation extends Invitation<UserInvitation> {
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  uid: TObjectId;

  type = UserInvitation.name;
}

export const UserInvitationSchema = SchemaFactory.createForClass(UserInvitation);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Invitation } from './invitation.schema';
import { IMailInvitation } from '../interfaces';

@Schema({ timestamps: true })
export class MailInvitation extends Invitation<MailInvitation> implements IMailInvitation {
  @Prop({ required: true })
  email: string;

  type = MailInvitation.name;
}

export const MailInvitationSchema = SchemaFactory.createForClass(MailInvitation);

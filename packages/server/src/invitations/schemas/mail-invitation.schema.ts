import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Invitation } from './invitation.schema';

@Schema({ timestamps: true })
export class MailInvitation extends Invitation<MailInvitation> {
  @Prop({ required: true })
  email: string;

  type = MailInvitation.name;
}

export const MailInvitationSchema = SchemaFactory.createForClass(MailInvitation);

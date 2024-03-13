import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Invitation } from './invitation.schema';
import { IMailInvitation } from '../interfaces';
import { BaseDocument, type StrictBaseDocumentData } from '@/core';

@Schema({ timestamps: true })
export class MailInvitation extends Invitation implements IMailInvitation {
  @Prop({ required: true })
  email: string;

  override type = MailInvitation.name;

  constructor(data: StrictBaseDocumentData<Omit<MailInvitation, 'type'>>) {
    super(false);
    BaseDocument.init(this, data);
  }
}

export const MailInvitationSchema = SchemaFactory.createForClass(MailInvitation);

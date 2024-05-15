import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { BaseDocument, type StrictBaseDocumentData, type TObjectId } from '@/core';
import { addMilliSeconds } from '@lyvely/dates';
import ms from 'ms';

export const TOKEN_EXPIRES_IN = '2m';

@Schema()
export class Captcha {
  _id: TObjectId;

  id: string;

  @Prop({ required: true })
  identity: string;

  @Prop({ required: true })
  token: string;

  @Prop({ type: Date, required: true })
  issuedAt: Date;

  constructor(data: StrictBaseDocumentData<Captcha>) {
    BaseDocument.init(this, data);
  }

  isExpired() {
    return addMilliSeconds(this.issuedAt, ms(TOKEN_EXPIRES_IN)) < new Date();
  }
}

export const CaptchaSchema = SchemaFactory.createForClass(Captcha);

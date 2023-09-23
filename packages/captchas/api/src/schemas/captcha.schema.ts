import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { BaseEntity, DocumentType } from '@lyvely/core';
import { addMilliSeconds } from '@lyvely/dates';
import ms from 'ms';

export const TOKEN_EXPIRES_IN = '2m';

@Schema()
export class Captcha extends BaseEntity<Captcha> {
  @Prop({ required: true })
  identity: string;

  @Prop({ required: true })
  token: string;

  @Prop({ type: Date, required: true })
  issuedAt: Date;

  isExpired() {
    return addMilliSeconds(this.issuedAt, ms(TOKEN_EXPIRES_IN)) < new Date();
  }
}

export const CaptchaSchema = SchemaFactory.createForClass(Captcha);
export type CaptchaDocument = DocumentType<Captcha>;

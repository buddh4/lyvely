import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { BaseEntity, DocumentType } from '@/core';

@Schema()
export class Captcha extends BaseEntity<Captcha> {
  @Prop()
  identity: string;

  @Prop()
  token: string;

  @Prop()
  purpose: string;
}

export const CaptchaSchema = SchemaFactory.createForClass(Captcha);
export type CaptchaDocument = DocumentType<Captcha>;

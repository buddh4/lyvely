import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  BaseDocument,
  MixedProp,
  ObjectIdProp,
  type StrictBaseDocumentData,
  TObjectId,
} from '@/core';
import { addMilliSeconds } from '@lyvely/dates';
import { OtpInfo, DEFAULT_MAX_OTP_ATTEMPTS } from '@lyvely/interface';

@Schema()
export class UserOtp<TContext = any> {
  @ObjectIdProp({ required: true })
  uid: TObjectId;

  @Prop({ required: true })
  otp: string;

  @Prop({ required: true })
  purpose: string;

  @Prop()
  remember?: boolean;

  @Prop({ required: true })
  issuedAt: Date;

  @Prop({ required: true })
  expiresIn: number;

  @MixedProp()
  context?: TContext;

  @Prop({ default: 0 })
  attempts: 0;

  _id: TObjectId;

  id: string;

  constructor(data: StrictBaseDocumentData<Omit<UserOtp, 'attempts'>>) {
    BaseDocument.init(this, data);
  }

  getOtpClientInfo(attemptsLeft?: number) {
    return new OtpInfo({
      issuedAt: this.issuedAt,
      expiresIn: this.expiresIn,
      attempts: this.attempts,
      maxAttempts: attemptsLeft ?? DEFAULT_MAX_OTP_ATTEMPTS,
    });
  }

  isExpired() {
    return addMilliSeconds(this.issuedAt, this.expiresIn) < new Date();
  }
}

export const UserOtpSchema = SchemaFactory.createForClass(UserOtp);

UserOtpSchema.index({ uid: 1, purpose: 1 }, { unique: true });

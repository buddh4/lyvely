import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseEntity, MixedProp, ObjectIdProp, TObjectId } from '@/core';
import { addMilliSeconds } from '@lyvely/dates';
import { OtpInfo, DEFAULT_MAX_OTP_ATTEMPTS } from '@lyvely/interface';

@Schema()
export class UserOtp<TContext = any> extends BaseEntity<UserOtp> {
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

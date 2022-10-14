import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { BaseEntity } from '@/modules/core';
import { addMilliSeconds } from '@lyvely/common';

@Schema()
export class UserOtp extends BaseEntity<UserOtp> {
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
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

  isExpired() {
    return addMilliSeconds(this.issuedAt, this.expiresIn) < new Date();
  }
}

export type UserOtpDocument = UserOtp & mongoose.Document;
export const UserOtpSchema = SchemaFactory.createForClass(UserOtp);

UserOtpSchema.index({ uid: 1, purpose: 1 }, { unique: true });

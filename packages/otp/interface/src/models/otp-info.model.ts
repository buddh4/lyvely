import { Exclude, Expose } from 'class-transformer';
import { BaseModel, PropertyType } from '@lyvely/core';
import { addMilliSeconds } from '@lyvely/dates';

export const DEFAULT_MAX_OTP_ATTEMPTS = 4;

@Exclude()
export class OtpInfo extends BaseModel<OtpInfo> {
  @Expose()
  @PropertyType(Date)
  issuedAt: Date;

  @Expose()
  expiresIn: number;

  @Expose()
  maxAttempts: number;

  @PropertyType(Number, { default: 0 })
  attempts: number;

  afterInit() {
    this.maxAttempts = this.maxAttempts ?? DEFAULT_MAX_OTP_ATTEMPTS;
  }

  requiresRefresh() {
    return !this.hasAttemptsLeft() || this.isExpired();
  }

  hasAttemptsLeft() {
    return this.maxAttempts > this.attempts;
  }

  isExpired() {
    return addMilliSeconds(this.issuedAt, this.expiresIn) < new Date();
  }
}

import { Exclude, Expose } from 'class-transformer';
import { BaseModel, PropertyType } from '@/models';
import { addMilliSeconds } from '@/calendar';

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

  attempts: number;

  afterInit() {
    this.attempts = this.attempts ?? 0;
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

import { Exclude, Expose } from 'class-transformer';
import {
  BaseModel,
  type PartialPropertiesOf,
  PropertyType,
  type StrictBaseModelData,
} from '@lyvely/common';
import { addMilliSeconds } from '@lyvely/dates';
import type { Optional } from '@lyvely/common/src';

export const DEFAULT_MAX_OTP_ATTEMPTS = 4;

@Exclude()
export class OtpInfo {
  @Expose()
  @PropertyType(Date)
  issuedAt: Date;

  @Expose()
  expiresIn: number;

  @Expose()
  @PropertyType(Number, { default: DEFAULT_MAX_OTP_ATTEMPTS })
  maxAttempts: number;

  @PropertyType(Number, { default: 0 })
  attempts: number;

  constructor(data: StrictBaseModelData<Optional<OtpInfo, 'maxAttempts' | 'attempts'>>) {
    BaseModel.init(this, data);
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

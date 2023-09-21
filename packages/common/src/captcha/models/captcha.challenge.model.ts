import { Expose } from 'class-transformer';
import { addMilliSeconds } from '@lyvely/calendar';
import { BaseModel, PropertyType } from '@lyvely/core';

@Expose()
export class CaptchaChallenge extends BaseModel<CaptchaChallenge> {
  identity: string;
  imageUrl: string;

  @PropertyType(Date)
  issuedAt: Date;
  expiresIn: number;

  isExpired() {
    return addMilliSeconds(this.issuedAt, this.expiresIn) < new Date();
  }
}

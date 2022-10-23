import { Expose } from 'class-transformer';
import { addMilliSeconds } from '@/calendar';
import { BaseModel, PropertyType } from '@/models';

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

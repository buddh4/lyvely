import { Expose } from 'class-transformer';
import { addMilliSeconds } from '@lyvely/dates';
import { BaseModel, type PropertiesOf, PropertyType } from '@lyvely/common';

@Expose()
export class CaptchaChallenge {
  identity: string;
  imageUrl: string;

  @PropertyType(Date)
  issuedAt: Date;
  expiresIn: number;

  constructor(data?: PropertiesOf<CaptchaChallenge>) {
    BaseModel.init(this, data);
  }

  isExpired() {
    return addMilliSeconds(this.issuedAt, this.expiresIn) < new Date();
  }
}

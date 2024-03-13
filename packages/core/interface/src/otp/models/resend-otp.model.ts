import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { type PropertiesOf } from '@lyvely/common';
import { Expose } from 'class-transformer';

@Expose()
export class ResendOtp {
  @IsString()
  emailOrUsername: string;

  @IsBoolean()
  @IsOptional()
  remember?: boolean;

  constructor(data: PropertiesOf<ResendOtp>) {
    this.emailOrUsername = data.emailOrUsername;
    this.remember = data.remember;
  }
}

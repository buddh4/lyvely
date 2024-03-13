import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { BaseModel, type PropertiesOf } from '@lyvely/common';

export class VerifyEmailDto {
  @IsString()
  emailOrUsername: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 6)
  @Matches('\\d{6}')
  otp: string;

  constructor(data?: PropertiesOf<VerifyEmailDto>) {
    BaseModel.init(this, data);
  }
}

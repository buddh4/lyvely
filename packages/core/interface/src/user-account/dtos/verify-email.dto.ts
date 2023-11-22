import { IsEmail, IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { BaseModel } from '@lyvely/common';

export class VerifyEmailDto extends BaseModel<VerifyEmailDto> {
  @IsString()
  emailOrUsername: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 6)
  @Matches('\\d{6}')
  otp: string;
}

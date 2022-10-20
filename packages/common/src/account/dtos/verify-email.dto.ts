import { IsEmail, IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { BaseModel } from '@/models';

export class VerifyEmailDto extends BaseModel<VerifyEmailDto> {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 6)
  @Matches('\\d{6}')
  otp: string;
}

import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { BaseModel } from '@/models';

export class VerifyEmailDto extends BaseModel<VerifyEmailDto> {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  otp: string;
}

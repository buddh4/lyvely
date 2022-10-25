import { BaseModel, PropertyType } from '@/models';
import { IsBoolean, IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { Match } from '@/validation';

export class SendResetPasswordMail extends BaseModel<SendResetPasswordMail> {
  @IsEmail()
  email: string;
}

export class ResetPassword extends BaseModel<ResetPassword> {
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(64)
  password: string;

  @IsNotEmpty()
  @Match('password')
  passwordRepeat: string;

  @IsString()
  @IsNotEmpty()
  token: string;

  @IsBoolean()
  @PropertyType(Boolean, { default: true })
  resetSessions: boolean;
}

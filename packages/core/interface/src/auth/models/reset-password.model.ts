import { BaseModel, PropertyType, Match } from '@lyvely/common';
import { IsBoolean, IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

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

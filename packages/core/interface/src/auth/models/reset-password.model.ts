import { BaseModel, PropertyType, SameAs } from '@lyvely/common';
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
  @SameAs('password')
  passwordRepeat: string;

  @IsString()
  @IsNotEmpty()
  token: string;

  @IsBoolean()
  @PropertyType(Boolean, { default: true })
  resetSessions: boolean;
}

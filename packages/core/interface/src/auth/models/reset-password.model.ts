import { BaseModel, PropertyType, SameAs } from '@lyvely/common';
import { IsBoolean, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class SendResetPasswordMail {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  usernameOrEmail: string;
}

export class ResetPassword {
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
  resetSessions: boolean;

  constructor(data?: ResetPassword) {
    BaseModel.init(this, data);
    this.resetSessions ??= true;
  }
}

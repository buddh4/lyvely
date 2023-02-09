import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString, Length, MaxLength, MinLength } from 'class-validator';
import { BaseModel } from '@/models';
import { Match, NotMatch } from '@/validation';
import { MAX_USER_NAME_LENGTH, MIN_USER_NAME_LENGTH } from '@/users';

export class UserRegistrationDto extends BaseModel<UserRegistrationDto> {
  @IsString()
  @Length(MIN_USER_NAME_LENGTH, MAX_USER_NAME_LENGTH)
  @IsNotEmpty()
  @NotMatch('email')
  readonly username: string;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(254)
  readonly email: string;

  @IsOptional()
  @IsString()
  readonly locale?: string;

  @IsOptional()
  @IsString()
  readonly inviteToken?: string;

  @IsString()
  @MinLength(6)
  @MaxLength(64)
  // @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,20}$/,
  //     { message: " A password at least contains one numeric digit, one uppercase char and one lowercase char" }
  // )
  readonly password: string;

  @IsString()
  @IsNotEmpty()
  @Match('password')
  readonly passwordRepeat: string;

  @IsOptional()
  @IsBoolean()
  remember?: boolean;
}

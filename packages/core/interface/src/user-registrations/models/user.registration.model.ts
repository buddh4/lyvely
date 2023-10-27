import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  Matches,
} from 'class-validator';
import { BaseModel, Match, NotMatch } from '@lyvely/common';
import { MAX_USER_NAME_LENGTH, MIN_USER_NAME_LENGTH, USER_NAME_REGEX } from '@/users';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UserRegistration extends BaseModel<UserRegistration> {
  @Expose()
  @IsString()
  @Length(MIN_USER_NAME_LENGTH, MAX_USER_NAME_LENGTH)
  @IsNotEmpty()
  @Matches(USER_NAME_REGEX)
  @NotMatch('email')
  username: string;

  @Expose()
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(254)
  email: string;

  @Expose()
  @IsOptional()
  @IsString()
  locale?: string;

  @Expose()
  @IsOptional()
  @IsString()
  inviteToken?: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @Length(6, 64)
  // @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,20}$/,
  //     { message: " A password at least contains one numeric digit, one uppercase char and one lowercase char" }
  // )
  password: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @Match('password')
  passwordRepeat: string;

  @Expose()
  @IsOptional()
  @IsBoolean()
  remember?: boolean;
}

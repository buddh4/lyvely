import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';
import { BaseModel } from '@/models';
import { Match, NotMatch } from '@/validation';
import { MAX_USER_NAME_LENGTH, MIN_USER_NAME_LENGTH } from '@/users';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UserRegistrationDto extends BaseModel<UserRegistrationDto> {
  @Expose()
  @IsString()
  @Length(MIN_USER_NAME_LENGTH, MAX_USER_NAME_LENGTH)
  @IsNotEmpty()
  @NotMatch('email')
  readonly username: string;

  @Expose()
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(254)
  readonly email: string;

  @Expose()
  @IsOptional()
  @IsString()
  readonly locale?: string;

  @Expose()
  @IsOptional()
  @IsString()
  readonly inviteToken?: string;

  @Expose()
  @IsString()
  @MinLength(6)
  @MaxLength(64)
  // @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,20}$/,
  //     { message: " A password at least contains one numeric digit, one uppercase char and one lowercase char" }
  // )
  readonly password: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @Match('password')
  readonly passwordRepeat: string;

  @Expose()
  @IsOptional()
  @IsBoolean()
  remember?: boolean;
}

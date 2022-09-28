import { IsEmail, IsNotEmpty, IsOptional, IsString, Length, MaxLength, MinLength } from 'class-validator';
import { BaseModel } from '@/models';

export class RegisterDto extends BaseModel<RegisterDto> {
  @IsString()
  @Length(2, 40)
  @IsNotEmpty()
  readonly username: string;

  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsOptional()
  @IsString()
  readonly locale?: string;

  @IsNotEmpty()
  @MinLength(5, { message: ' The min length of password is 8 ' })
  @MaxLength(20, {
    message: " The password can't accept more than 20 characters ",
  })
  // @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,20}$/,
  //     { message: " A password at least contains one numeric digit, one supercase char and one lowercase char" }
  // )
  readonly password: string;
}

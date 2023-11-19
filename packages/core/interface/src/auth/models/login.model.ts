import { Expose } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, Length, MaxLength } from 'class-validator';

@Expose()
export class LoginModel {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  usernameOrEmail: string;

  @Length(6, 64)
  @IsNotEmpty()
  password: string;

  @IsOptional()
  @IsBoolean()
  remember?: boolean;
}

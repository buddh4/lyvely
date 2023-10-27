import { Expose } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

@Expose()
export class LoginModel {
  @IsString()
  usernameOrEmail: string;

  @IsNotEmpty()
  password: string;

  @IsOptional()
  @IsBoolean()
  remember?: boolean;
}

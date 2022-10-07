import { Expose } from 'class-transformer';
import { IsBoolean, IsEmail, IsNotEmpty } from 'class-validator';

@Expose()
export class LoginModel {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsBoolean()
  remember: boolean;
}

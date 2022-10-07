import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';

@Expose()
export class LoginModel {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}

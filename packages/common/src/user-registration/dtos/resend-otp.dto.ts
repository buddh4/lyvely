import { IsEmail } from 'class-validator';
import { BaseModel } from '@/models';

export class ResendOtpDto extends BaseModel<ResendOtpDto> {
  @IsEmail()
  email: string;
}

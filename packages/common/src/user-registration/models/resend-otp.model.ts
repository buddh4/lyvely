import { IsBoolean, IsEmail, IsOptional } from 'class-validator';
import { BaseModel } from '@/models';
import { Expose } from 'class-transformer';

@Expose()
export class ResendOtp extends BaseModel<ResendOtp> {
  @IsEmail()
  email: string;

  @IsBoolean()
  @IsOptional()
  remember?: boolean;
}

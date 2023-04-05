import { IsBoolean, IsEmail, IsOptional } from 'class-validator';
import { BaseModel } from '@/models';
import { Expose } from 'class-transformer';

@Expose()
export class ResendOtpDto extends BaseModel<ResendOtpDto> {
  @IsEmail()
  email: string;

  @IsBoolean()
  @IsOptional()
  remember?: boolean;
}

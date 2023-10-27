import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { BaseModel } from '@lyvely/common';
import { Expose } from 'class-transformer';

@Expose()
export class ResendOtp extends BaseModel<ResendOtp> {
  @IsString()
  emailOrUsername: string;

  @IsBoolean()
  @IsOptional()
  remember?: boolean;
}

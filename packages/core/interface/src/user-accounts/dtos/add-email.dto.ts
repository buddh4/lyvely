import { Expose } from 'class-transformer';
import { IsEmail } from 'class-validator';
import { BaseModel } from '@lyvely/common';

@Expose()
export class AddEmailDto extends BaseModel<AddEmailDto> {
  @IsEmail()
  email: string;
}

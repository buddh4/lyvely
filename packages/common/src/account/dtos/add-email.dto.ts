import { Expose } from 'class-transformer';
import { IsEmail } from 'class-validator';
import { BaseModel } from '@/models';

@Expose()
export class AddEmailDto extends BaseModel<AddEmailDto> {
  @IsEmail()
  email: string;
}

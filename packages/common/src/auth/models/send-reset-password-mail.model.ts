import { Exclude, Expose } from 'class-transformer';
import { BaseModel } from '@/models';
import { IsEmail } from 'class-validator';

@Exclude()
export class SendResetPasswordMailModel extends BaseModel<SendResetPasswordMailModel> {
  @Expose()
  @IsEmail()
  email: string;
}

import { Expose } from 'class-transformer';
import { IsEmail } from 'class-validator';
import { BaseModel, type PropertiesOf } from '@lyvely/common';

@Expose()
export class AddEmailDto {
  @IsEmail()
  email: string;

  constructor(data?: PropertiesOf<AddEmailDto>) {
    BaseModel.init(this, data);
  }
}

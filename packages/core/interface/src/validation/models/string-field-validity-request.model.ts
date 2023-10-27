import { BaseModel } from '@lyvely/common';
import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class StringFieldValidityRequest extends BaseModel<StringFieldValidityRequest> {
  @Expose()
  @IsString()
  value?: string;
}

import { BaseModel, type PropertiesOf } from '@lyvely/common';
import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class StringFieldValidityRequest {
  @Expose()
  @IsString()
  value?: string;

  constructor(data: PropertiesOf<StringFieldValidityRequest>) {
    BaseModel.init(this, data);
  }
}

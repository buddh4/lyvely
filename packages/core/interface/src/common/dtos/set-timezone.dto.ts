import { IsString } from 'class-validator';
import { BaseModel, IsIn, type PropertiesOf } from '@lyvely/common';
import { getTimezones } from '@lyvely/dates';
import { Expose } from 'class-transformer';

@Expose()
export class SetTimezoneDto {
  @IsIn(() => getTimezones())
  @IsString()
  timezone: string;

  constructor(data: PropertiesOf<SetTimezoneDto>) {
    BaseModel.init(this, data);
  }
}

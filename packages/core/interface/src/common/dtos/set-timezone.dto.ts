import { IsString } from 'class-validator';
import { BaseModel, IsIn } from '@lyvely/common';
import { getTimezones } from '@lyvely/dates';
import { Expose } from 'class-transformer';

@Expose()
export class SetTimezoneDto extends BaseModel<SetTimezoneDto> {
  @IsIn(() => getTimezones())
  @IsString()
  timezone: string;
}

import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';
import { BaseModel, IsIn } from '@lyvely/common';
import { getEnabledLocales } from '@lyvely/dates';

@Expose()
export class UpdateRegionSettingsDto extends BaseModel<UpdateRegionSettingsDto> {
  @IsString()
  firstDayOfWeek: string;
}

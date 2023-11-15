import { IsString } from 'class-validator';
import { BaseModel, IsIn } from '@lyvely/common';
import { getEnabledLocales } from '@lyvely/dates';
import { Expose } from 'class-transformer';

@Expose()
export class SetLanguageDto extends BaseModel<SetLanguageDto> {
  @IsIn(() => getEnabledLocales())
  @IsString()
  locale: string;
}

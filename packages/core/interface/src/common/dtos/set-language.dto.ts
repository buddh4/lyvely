import { IsString } from 'class-validator';
import { BaseModel, IsIn, type PropertiesOf } from '@lyvely/common';
import { getEnabledLocales } from '@lyvely/dates';
import { Expose } from 'class-transformer';

@Expose()
export class SetLanguageDto {
  @IsIn(() => getEnabledLocales())
  @IsString()
  locale: string;

  constructor(data: PropertiesOf<SetLanguageDto>) {
    BaseModel.init(this, data);
  }
}

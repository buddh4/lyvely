import { type PropertiesOf } from '@lyvely/common';
import { Expose, Exclude } from 'class-transformer';
import { IsString } from 'class-validator';

@Exclude()
export class UpdateFeatureResponseModel {
  @Expose()
  @IsString({ each: true })
  enabled: string[];

  @Expose()
  @IsString({ each: true })
  disabled: string[];

  constructor(data: PropertiesOf<UpdateFeatureResponseModel>) {
    this.enabled = data.enabled;
    this.disabled = data.disabled;
  }
}

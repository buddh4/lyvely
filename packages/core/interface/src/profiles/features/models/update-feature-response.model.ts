import { BaseModel } from '@lyvely/common';
import { Expose, Exclude } from 'class-transformer';
import { IsString } from 'class-validator';

@Exclude()
export class UpdateFeatureResponseModel extends BaseModel<UpdateFeatureResponseModel> {
  @Expose()
  @IsString({ each: true })
  enabled: string[];

  @Expose()
  @IsString({ each: true })
  disabled: string[];
}

import { BaseModel } from '@lyvely/common';
import { Expose, Exclude } from 'class-transformer';
import { IsBoolean, IsString } from 'class-validator';

@Exclude()
export class UpdateFeatureModel extends BaseModel<UpdateFeatureModel> {
  @Expose()
  @IsString()
  featureId: string;

  @Expose()
  @IsBoolean()
  state: boolean;
}

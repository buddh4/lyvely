import { type PropertiesOf } from '@lyvely/common';
import { Expose, Exclude } from 'class-transformer';
import { IsBoolean, IsString } from 'class-validator';

@Exclude()
export class UpdateFeatureModel {
  @Expose()
  @IsString()
  featureId: string;

  @Expose()
  @IsBoolean()
  state: boolean;

  constructor(data?: PropertiesOf<UpdateFeatureModel>) {
    if (data) {
      this.featureId = data.featureId;
      this.state = data.state;
    }
  }
}

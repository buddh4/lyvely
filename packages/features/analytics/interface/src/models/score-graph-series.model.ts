import { Exclude, Expose } from 'class-transformer';
import { IsBoolean, IsMongoId, IsOptional } from 'class-validator';
import type { PartialPropertiesOf } from '@lyvely/common';
import { Model } from '@lyvely/common';

@Exclude()
export class ScoreGraphSeriesModel {
  @IsMongoId()
  @IsOptional()
  @Expose()
  uid?: string;

  @IsBoolean()
  @IsOptional()
  visitor: boolean;

  constructor(data: PartialPropertiesOf<ScoreGraphSeriesModel>) {
    Model.init(this, data);
  }
}

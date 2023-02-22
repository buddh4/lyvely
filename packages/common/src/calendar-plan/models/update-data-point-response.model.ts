import { Exclude, Expose, Type } from 'class-transformer';
import { BaseModel, PropertyType } from '@/models';
import { DataPointModel } from '@/time-series';

@Exclude()
export class UpdateDataPointResponse extends BaseModel<UpdateDataPointResponse> {
  @Expose()
  @Type(() => DataPointModel)
  @PropertyType(DataPointModel)
  dataPoint: DataPointModel;
}

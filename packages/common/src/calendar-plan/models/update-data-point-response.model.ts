import { Expose } from 'class-transformer';
import { BaseModel } from '@/models';
import { DataPointModel } from '@/time-series';

@Expose()
export class UpdateDataPointResponse<T = { dataPoint: DataPointModel }> extends BaseModel<T> {
  dataPoint: DataPointModel;
}

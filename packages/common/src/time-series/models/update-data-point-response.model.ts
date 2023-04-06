import { Expose } from 'class-transformer';
import { BaseModel } from '@/models';
import { DataPointModel } from './data-point.model';

@Expose()
export class UpdateDataPointResponse<T = { dataPoint: DataPointModel }> extends BaseModel<T> {
  dataPoint: DataPointModel;
}

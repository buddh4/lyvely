import { Expose } from 'class-transformer';
import { BaseModel, PropertyType } from '@/models';
import { DataPointModel } from './data-point.model';
import { TimeSeriesContentModel } from './time-series-content.model';

@Expose()
export class UpdateDataPointResponse<
  T = { dataPoint: DataPointModel; model: TimeSeriesContentModel },
> extends BaseModel<T> {
  @PropertyType(DataPointModel)
  dataPoint: DataPointModel;

  @PropertyType(TimeSeriesContentModel)
  model: TimeSeriesContentModel;
}

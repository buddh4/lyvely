import { Expose } from 'class-transformer';
import { BaseModel, type BaseModelData, PropertyType } from '@lyvely/common';
import { DataPointModel } from './data-point.model';
import { TimeSeriesContentModel } from './time-series-content.model';

@Expose()
export class UpdateDataPointResponse {
  @PropertyType(DataPointModel)
  dataPoint: DataPointModel;

  @PropertyType(TimeSeriesContentModel)
  model: TimeSeriesContentModel;

  constructor(data: BaseModelData<UpdateDataPointResponse>) {
    BaseModel.init(this, data);
  }
}

import { ChartModel } from './chart.model';
import { PropertyType, BaseModel, type BaseModelData } from '@lyvely/common';
import { Expose } from 'class-transformer';

export class ChartListModel<TID = string> {
  @Expose()
  @PropertyType([ChartModel])
  charts: ChartModel<TID>[];

  constructor(data: BaseModelData<ChartListModel<any>>) {
    BaseModel.init(this, data);
  }
}

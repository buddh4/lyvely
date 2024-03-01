import { ChartModel } from './chart.model';
import { Model, PropertyType, PartialPropertiesOf } from '@lyvely/common';
import { Expose } from 'class-transformer';

export class ChartListModel<TID = string> {
  @Expose()
  @PropertyType([ChartModel])
  charts: ChartModel<TID>[];

  constructor(data: PartialPropertiesOf<ChartListModel<any>>) {
    Model.init(this, data);
  }
}

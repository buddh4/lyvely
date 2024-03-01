import { Expose } from 'class-transformer';
import { Model, PartialPropertiesOf, PropertyType } from '@lyvely/common';
import { ContentUpdateResponse } from '@lyvely/interface';
import { ChartModel } from './chart.model';

export class UpdateChartResponseModel extends ContentUpdateResponse<ChartModel> {
  @Expose()
  @PropertyType(ChartModel)
  model: ChartModel;

  constructor(data?: PartialPropertiesOf<UpdateChartResponseModel>) {
    super();
    Model.init(this, data);
  }
}

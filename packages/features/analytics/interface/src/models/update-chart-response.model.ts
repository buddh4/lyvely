import { Expose } from 'class-transformer';
import { BaseModel, BaseModelData, PropertyType } from '@lyvely/common';
import { ContentUpdateResponse } from '@lyvely/interface';
import { ChartModel } from './chart.model';

export class UpdateChartResponseModel extends ContentUpdateResponse<ChartModel> {
  @Expose()
  @PropertyType(ChartModel)
  model: ChartModel;

  constructor(data: BaseModelData<UpdateChartResponseModel>) {
    super(false);
    BaseModel.init(this, data);
  }
}

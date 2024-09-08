import { Exclude, Expose } from 'class-transformer';
import { CreateContentModel } from '@lyvely/interface';
import { IsString } from 'class-validator';
import { type BaseModelData, BaseModel } from '@lyvely/common';
import type { ChartSeriesConfigModel } from './chart-series-config.model';
import { TIME_SERIES_CHART } from './time-series-chart.category';

@Exclude()
export class CreateChartModel extends CreateContentModel {
  @Expose()
  @IsString()
  category: string = TIME_SERIES_CHART.id;

  @Expose()
  series: ChartSeriesConfigModel;

  constructor(data?: BaseModelData<CreateChartModel>) {
    super(false);
    BaseModel.init(this, data);
  }
}

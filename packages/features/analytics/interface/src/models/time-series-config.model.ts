import { Exclude, Expose } from 'class-transformer';
import { IsEnum } from 'class-validator';
import { BaseModel, type BaseModelData, PropertyType } from '@lyvely/common';
import { TimeSeriesChartType } from '../interfaces';
import { ChartSeriesConfigModel } from './chart-series-config.model';

@Exclude()
export class TimeSeriesConfigModel extends ChartSeriesConfigModel {
  @Expose()
  @IsEnum(TimeSeriesChartType)
  @PropertyType(String, { default: TimeSeriesChartType.Line })
  chartType: TimeSeriesChartType;

  constructor(data: BaseModelData<TimeSeriesConfigModel>) {
    super(false);
    BaseModel.init(this, data);
  }
}

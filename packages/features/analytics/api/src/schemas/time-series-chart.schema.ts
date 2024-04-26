import { NestedSchema } from '@lyvely/api';
import { BaseModel, type BaseModelData } from '@lyvely/common';
import { ChartConfig } from './chart.schema';
import { TIME_SERIES_CHART } from '@lyvely/analytics-interface';
import { ChartSchemaFactory } from './chart-schema.factory';

@NestedSchema()
export class TimeSeriesChartConfig extends ChartConfig {
  override category = TIME_SERIES_CHART.id;

  constructor(data: BaseModelData<TimeSeriesChartConfig>) {
    super(false);
    BaseModel.init(this, data);
  }
}

export const TimeSeriesChartConfigSchema = ChartSchemaFactory.createForClass(
  TIME_SERIES_CHART.id,
  TimeSeriesChartConfig,
);

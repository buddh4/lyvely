import {
  CHART_SERIES_PROFILE_SCORE,
  TimeSeriesChartType,
  TimeSeriesConfigModel,
} from '@lyvely/analytics-interface';
import { TimeSeriesChartConfigSchema } from './time-series-chart.schema';
import { ChartSchemaFactory } from './chart-schema.factory';
import { NestedSchema, ObjectIdArrayProp, TObjectId } from '@lyvely/api';
import { ChartSeriesConfig } from './chart-series-config.schema';
import { Prop } from '@nestjs/mongoose';
import { BaseModel, getStringEnumValues, type StrictBaseModelData } from '@lyvely/common';

@NestedSchema()
export class ProfileScoreChartSeriesConfig
  extends ChartSeriesConfig
  implements TimeSeriesConfigModel
{
  override readonly type = CHART_SERIES_PROFILE_SCORE.id;

  @Prop({ required: true, enum: getStringEnumValues(TimeSeriesChartType) })
  chartType: TimeSeriesChartType;

  @ObjectIdArrayProp()
  tagIds?: Array<TObjectId>;

  @Prop({ required: true })
  color?: string;

  constructor(data?: Omit<StrictBaseModelData<ProfileScoreChartSeriesConfig>, 'type'>) {
    super(false);
    BaseModel.init(this, data);
  }
}

export const ProfileScoreChartSeriesConfigSchema = ChartSchemaFactory.createSeriesForClass(
  CHART_SERIES_PROFILE_SCORE.id,
  TimeSeriesChartConfigSchema,
  ProfileScoreChartSeriesConfig
);

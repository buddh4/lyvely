import { NestedSchema, ObjectIdArrayProp, TObjectId } from '@lyvely/api';
import { Prop } from '@nestjs/mongoose';
import {
  CHART_SERIES_PROFILE_SCORE,
  TimeSeriesChartType,
  UserScoreSeriesConfigModel,
} from '@lyvely/analytics-interface';
import { TimeSeriesChartConfigSchema } from './time-series-chart.schema';
import { ChartSeriesConfig } from './chart-series-config.schema';
import { ChartSchemaFactory } from './chart-schema.factory';
import { getStringEnumValues } from '@lyvely/common';

@NestedSchema()
export class UserScoreChartSeriesConfig
  extends ChartSeriesConfig
  implements UserScoreSeriesConfigModel<TObjectId>
{
  override readonly type = CHART_SERIES_PROFILE_SCORE.id;

  @Prop({ required: true, enum: getStringEnumValues(TimeSeriesChartType) })
  chartType: TimeSeriesChartType;

  @ObjectIdArrayProp()
  uids?: Array<TObjectId>;

  @ObjectIdArrayProp()
  tagIds?: Array<TObjectId>;

  @Prop()
  currentUser?: boolean;
}

export const UserScoreChartSeriesConfigSchema = ChartSchemaFactory.createSeriesForClass(
  CHART_SERIES_PROFILE_SCORE.id,
  TimeSeriesChartConfigSchema,
  UserScoreChartSeriesConfig,
);

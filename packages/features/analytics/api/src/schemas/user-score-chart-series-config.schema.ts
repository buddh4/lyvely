import { NestedSchema, ObjectIdArrayProp, Subdocument, TObjectId } from '@lyvely/api';
import { Prop, SchemaFactory } from '@nestjs/mongoose';
import {
  CHART_SERIES_PROFILE_SCORE,
  UserScoreSeriesConfigModel,
} from '@lyvely/analytics-interface';
import { GraphChartConfigSchema } from './graph-chart.schema';
import { ChartSeriesConfig } from './chart-series-config.schema';

@NestedSchema()
export class UserScoreChartSeriesConfig
  extends ChartSeriesConfig
  implements UserScoreSeriesConfigModel<TObjectId>
{
  override readonly type = CHART_SERIES_PROFILE_SCORE.id;

  @ObjectIdArrayProp()
  uids?: Array<TObjectId>;

  @ObjectIdArrayProp()
  tagIds?: Array<TObjectId>;

  @Prop()
  currentUser?: boolean;
}

const UserScoreChartSeriesConfigSchema = SchemaFactory.createForClass(UserScoreChartSeriesConfig);

GraphChartConfigSchema.path<Subdocument>('series').discriminator(
  CHART_SERIES_PROFILE_SCORE.id,
  UserScoreChartSeriesConfigSchema,
);

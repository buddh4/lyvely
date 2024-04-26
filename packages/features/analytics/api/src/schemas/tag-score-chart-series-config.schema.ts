import { NestedSchema, ObjectIdArrayProp, TObjectId } from '@lyvely/api';
import {
  CHART_SERIES_TAG_SCORE,
  TagScoreSeriesConfigModel,
  TimeSeriesChartType,
} from '@lyvely/analytics-interface';
import { TimeSeriesChartConfigSchema } from './time-series-chart.schema';
import { ChartSeriesConfig } from './chart-series-config.schema';
import { ChartSchemaFactory } from './chart-schema.factory';
import { Prop } from '@nestjs/mongoose';
import { getStringEnumValues } from '@lyvely/common';

@NestedSchema()
export class TagScoreChartSeriesConfig
  extends ChartSeriesConfig
  implements TagScoreSeriesConfigModel<TObjectId>
{
  override readonly type = CHART_SERIES_TAG_SCORE.id;

  @Prop({ required: true, enum: getStringEnumValues(TimeSeriesChartType) })
  chartType: TimeSeriesChartType;

  @ObjectIdArrayProp()
  tagIds?: Array<TObjectId>;
}

export const TagScoreChartSeriesConfigSchema = ChartSchemaFactory.createSeriesForClass(
  CHART_SERIES_TAG_SCORE.id,
  TimeSeriesChartConfigSchema,
  TagScoreChartSeriesConfig,
);

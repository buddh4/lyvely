import { NestedSchema, ObjectIdArrayProp, Subdocument, TObjectId } from '@lyvely/api';
import { SchemaFactory } from '@nestjs/mongoose';
import { CHART_SERIES_TAG_SCORE, TagScoreSeriesConfigModel } from '@lyvely/analytics-interface';
import { GraphChartConfigSchema } from './graph-chart.schema';
import { ChartSeriesConfig } from './chart-series-config.schema';

@NestedSchema()
export class TagScoreChartSeriesConfig
  extends ChartSeriesConfig
  implements TagScoreSeriesConfigModel<TObjectId>
{
  override readonly type = CHART_SERIES_TAG_SCORE.id;

  @ObjectIdArrayProp()
  tagIds?: Array<TObjectId>;
}

const TagScoreChartSeriesConfigSchema = SchemaFactory.createForClass(TagScoreChartSeriesConfig);

GraphChartConfigSchema.path<Subdocument>('series').discriminator(
  CHART_SERIES_TAG_SCORE.id,
  TagScoreChartSeriesConfigSchema,
);

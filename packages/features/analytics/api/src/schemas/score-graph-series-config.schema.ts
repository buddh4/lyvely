import { NestedSchema, ObjectIdArrayProp, ObjectIdProp, Subdocument, TObjectId } from '@lyvely/api';
import { Prop, SchemaFactory } from '@nestjs/mongoose';
import {
  CHART_SERIES_TYPE_SCORE,
  ScoreChartSeriesConfigModel,
  UpdateChartSeriesModel,
} from '@lyvely/analytics-interface';
import { GraphChartConfig, GraphChartConfigSchema } from './graph-chart.schema';
import { ChartSeriesConfig } from './chart-series-config.schema';

@NestedSchema()
export class ScoreChartSeriesConfig
  extends ChartSeriesConfig
  implements ScoreChartSeriesConfigModel<TObjectId>
{
  override type = CHART_SERIES_TYPE_SCORE;

  @ObjectIdArrayProp()
  uids?: Array<TObjectId>;

  constructor(model: UpdateChartSeriesModel) {
    super({
      name: model.config.name,
    });
  }
}

const ScoreGraphSeriesSchema = SchemaFactory.createForClass(GraphChartConfig);

GraphChartConfigSchema.path<Subdocument>('series').discriminator(
  CHART_SERIES_TYPE_SCORE,
  ScoreGraphSeriesSchema,
);

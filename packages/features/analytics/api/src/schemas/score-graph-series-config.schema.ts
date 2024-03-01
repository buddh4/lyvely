import { NestedSchema, Subdocument } from '@lyvely/api';
import { SchemaFactory } from '@nestjs/mongoose';
import { GRAPH_TYPE_SCORE } from '@lyvely/analytics-interface';
import { GraphChartConfig, GraphChartConfigSchema, GraphChartSeries } from './graph-chart.schema';

@NestedSchema()
export class ScoreGraphSeries extends GraphChartSeries {
  type = GRAPH_TYPE_SCORE;
}

const ScoreGraphSeriesSchema = SchemaFactory.createForClass(GraphChartConfig);

GraphChartConfigSchema.path<Subdocument>('series').discriminator(
  GRAPH_TYPE_SCORE,
  ScoreGraphSeriesSchema,
);

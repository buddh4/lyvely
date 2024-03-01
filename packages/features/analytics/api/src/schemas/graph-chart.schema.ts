import { NestedSchema, ObjectIdProp, TObjectId, Subdocument } from '@lyvely/api';
import { BaseModel, getStringEnumValues, getNumberEnumValues } from '@lyvely/common';
import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { ChartAccumulation, ChartType } from '@lyvely/analytics-interface';
import { CalendarInterval } from '@lyvely/dates';
import { ChartConfig, ChartSchema } from './chart.schema';

@NestedSchema({ discriminatorKey: 'type' })
export class GraphChartSeriesFilter extends BaseModel<GraphChartSeriesFilter> {
  @ObjectIdProp()
  uid?: TObjectId;
}

const GraphChartSeriesFilterSchema = SchemaFactory.createForClass(GraphChartSeriesFilter);

@NestedSchema({ discriminatorKey: 'type' })
export class GraphChartSeries extends BaseModel<GraphChartSeries> {
  @Prop({ enum: getStringEnumValues(ChartAccumulation), required: true })
  accumulation?: ChartAccumulation;

  @Prop({ type: GraphChartSeriesFilterSchema })
  filter?: GraphChartSeriesFilter;

  type: string;
}

export const GraphChartSeriesSchema = SchemaFactory.createForClass(GraphChartSeries);

@NestedSchema()
export class GraphChartConfig extends ChartConfig<GraphChartConfig> {
  type = ChartType.Graph;

  @Prop({ enum: getNumberEnumValues(CalendarInterval) })
  interval: CalendarInterval;

  @Prop({ type: [GraphChartSeriesSchema] })
  series: GraphChartSeries[];
}

export const GraphChartConfigSchema = SchemaFactory.createForClass(GraphChartConfig);

ChartSchema.path<Subdocument>('config').discriminator(ChartType.Graph, GraphChartConfigSchema);

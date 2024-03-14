import { NestedSchema, Subdocument } from '@lyvely/api';
import { BaseModel, type BaseModelData, getNumberEnumValues } from '@lyvely/common';
import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { ChartType } from '@lyvely/analytics-interface';
import { CalendarInterval } from '@lyvely/dates';
import { ChartConfig, ChartSchema } from './chart.schema';
import { ChartSeriesConfig, ChartSeriesConfigSchema } from './chart-series-config.schema';

@NestedSchema()
export class GraphChartConfig extends ChartConfig {
  override type = ChartType.Graph;

  @Prop({ enum: getNumberEnumValues(CalendarInterval) })
  interval: CalendarInterval;

  constructor(data: BaseModelData<GraphChartConfig>) {
    super(false);
    BaseModel.init(this, data);
  }
}

export const GraphChartConfigSchema = SchemaFactory.createForClass(GraphChartConfig);

ChartSchema.path<Subdocument>('config').discriminator(ChartType.Graph, GraphChartConfigSchema);

import { NestedSchema, Subdocument } from '@lyvely/api';
import { BaseModel, type BaseModelData } from '@lyvely/common';
import { SchemaFactory } from '@nestjs/mongoose';
import { ChartCategory } from '@lyvely/analytics-interface';
import { ChartConfig, ChartSchema } from './chart.schema';

@NestedSchema()
export class GraphChartConfig extends ChartConfig {
  override category = ChartCategory.Graph;

  constructor(data: BaseModelData<GraphChartConfig>) {
    super(false);
    BaseModel.init(this, data);
  }
}

export const GraphChartConfigSchema = SchemaFactory.createForClass(GraphChartConfig);

ChartSchema.path<Subdocument>('config').discriminator(ChartCategory.Graph, GraphChartConfigSchema);

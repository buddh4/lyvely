import { BaseDocument, NestedSchema } from '@lyvely/api';
import { Prop, SchemaFactory } from '@nestjs/mongoose';

@NestedSchema({ discriminatorKey: 'type' })
export class ChartSeriesConfig extends BaseDocument<ChartSeriesConfig> {
  @Prop({ required: true })
  name: string;

  type: string;
}

export const ChartSeriesConfigSchema = SchemaFactory.createForClass(ChartSeriesConfig);

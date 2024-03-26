import { BaseDocument, type BaseDocumentData, NestedSchema, type TObjectId } from '@lyvely/api';
import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { ChartType } from '@lyvely/analytics-interface';
import type { PropertiesOf } from '@lyvely/common';
import type { ChartSeriesConfigModel } from '@lyvely/analytics-interface';

@NestedSchema({ discriminatorKey: 'type' })
export class ChartSeriesConfig implements PropertiesOf<ChartSeriesConfigModel> {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  chartType: ChartType;

  type: string;

  id: string;
  _id: TObjectId;

  constructor(data: BaseDocumentData<ChartSeriesConfig>) {
    BaseDocument.init(this, data);
  }
}

export const ChartSeriesConfigSchema = SchemaFactory.createForClass(ChartSeriesConfig);

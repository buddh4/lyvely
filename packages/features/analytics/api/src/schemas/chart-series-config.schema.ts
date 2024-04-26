import { BaseDocument, type BaseDocumentData, type TObjectId } from '@lyvely/api';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { PropertiesOf } from '@lyvely/common';
import type { ChartSeriesConfigModel } from '@lyvely/analytics-interface';

@Schema({ discriminatorKey: 'type' })
export class ChartSeriesConfig implements PropertiesOf<ChartSeriesConfigModel> {
  @Prop({ required: true })
  name: string;

  type: string;

  id: string;
  _id: TObjectId;

  constructor(data: BaseDocumentData<ChartSeriesConfig>) {
    BaseDocument.init(this, data);
  }
}

export const ChartSeriesConfigSchema = SchemaFactory.createForClass(ChartSeriesConfig);

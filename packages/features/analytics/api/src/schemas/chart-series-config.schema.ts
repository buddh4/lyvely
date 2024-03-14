import { BaseDocument, type BaseDocumentData, NestedSchema, type TObjectId } from '@lyvely/api';
import { Prop, SchemaFactory } from '@nestjs/mongoose';

@NestedSchema({ discriminatorKey: 'type' })
export class ChartSeriesConfig {
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

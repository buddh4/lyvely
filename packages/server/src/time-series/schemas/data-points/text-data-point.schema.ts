import { Prop, Schema } from '@nestjs/mongoose';
import { DataPoint } from './data-point.schema';
import { DataPointValueType, PropertiesOf, TextDataPointModel } from '@lyvely/common';
import { DataPointSchemaFactory } from '@/time-series/schemas/data-points/data-point-schema.factory';

@Schema()
export class TextDataPoint
  extends DataPoint<TextDataPoint>
  implements PropertiesOf<TextDataPointModel>
{
  @Prop({ required: true })
  value: string;

  valueType: typeof DataPointValueType.Text;

  afterInit() {
    this.valueType = DataPointValueType.Text;
  }
}

export const TextDataPointSchema = DataPointSchemaFactory.createForClass(
  DataPointValueType.Text,
  TextDataPoint,
);

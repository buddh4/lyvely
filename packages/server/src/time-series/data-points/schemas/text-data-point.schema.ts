import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { DataPoint } from './data-point.schema';
import { DataPointValueType } from '@lyvely/common';

@Schema()
export class TextDataPoint extends DataPoint<TextDataPoint> {
  @Prop({ required: true })
  value: string;

  afterInit() {
    this.valueType = DataPointValueType.Text;
  }
}

export const TextDataPointSchema = SchemaFactory.createForClass(TextDataPoint);

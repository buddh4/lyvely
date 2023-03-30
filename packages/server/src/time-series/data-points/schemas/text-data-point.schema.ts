import { Prop } from '@nestjs/mongoose';
import { DataPoint } from './data-point.schema';
import { DataPointValueType, TextDataPointModel } from '@lyvely/common';

export abstract class TextDataPoint extends DataPoint<TextDataPoint, TextDataPointModel> {
  @Prop({ required: true })
  value: string;

  afterInit() {
    this.valueType = DataPointValueType.Text;
  }
}

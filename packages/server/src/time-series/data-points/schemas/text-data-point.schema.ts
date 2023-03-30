import { Prop } from '@nestjs/mongoose';
import { DataPoint } from './data-point.schema';
import { DataPointValueType } from '@lyvely/common';

export abstract class TextDataPoint extends DataPoint<TextDataPoint> {
  @Prop({ required: true })
  value: string;

  afterInit() {
    this.valueType = DataPointValueType.Text;
  }
}

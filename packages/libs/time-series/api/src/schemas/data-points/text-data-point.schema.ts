import { Prop, Schema } from '@nestjs/mongoose';
import { DataPoint } from './data-point.schema';
import { PropertiesOf } from '@lyvely/common';
import { DataPointValueType, TextDataPointModel } from '@lyvely/time-series-interface';
import { DataPointSchemaFactory } from './data-point-schema.factory';
import { Types } from 'mongoose';

@Schema()
export class TextDataPoint
  extends DataPoint<TextDataPoint>
  implements PropertiesOf<TextDataPointModel<Types.ObjectId>>
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

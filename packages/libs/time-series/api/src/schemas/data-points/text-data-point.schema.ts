import { Prop, Schema } from '@nestjs/mongoose';
import { DataPoint } from './data-point.schema';
import { PropertiesOf } from '@lyvely/common';
import { TObjectId } from '@lyvely/core';
import { DataPointValueType, TextDataPointModel } from '@lyvely/time-series-interface';
import { DataPointSchemaFactory } from './data-point-schema.factory';

@Schema()
export class TextDataPoint
  extends DataPoint<TextDataPoint>
  implements PropertiesOf<TextDataPointModel<TObjectId>>
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

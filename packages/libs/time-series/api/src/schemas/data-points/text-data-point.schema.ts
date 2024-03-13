import { Prop, Schema } from '@nestjs/mongoose';
import { DataPoint } from './data-point.schema';
import { PropertiesOf } from '@lyvely/common';
import { TObjectId } from '@lyvely/api';
import { DataPointValueType, TextDataPointModel } from '@lyvely/time-series-interface';
import { DataPointSchemaFactory } from './data-point-schema.factory';

@Schema()
export class TextDataPoint
  extends DataPoint
  implements PropertiesOf<TextDataPointModel<TObjectId>>
{
  @Prop({ required: true })
  override value: string;

  override valueType: typeof DataPointValueType.Text = DataPointValueType.Text;
}

export const TextDataPointSchema = DataPointSchemaFactory.createForClass(
  DataPointValueType.Text,
  TextDataPoint,
);

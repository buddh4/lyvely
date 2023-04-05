import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { DataPoint } from './data-point.schema';
import { BaseModel, ISelectionDataPointValue, PropertyType } from '@lyvely/common';
import { NestedSchema } from '@/core';

@NestedSchema()
export class SelectionDataPointValue
  extends BaseModel<SelectionDataPointValue>
  implements ISelectionDataPointValue
{
  @Prop({ type: [String], required: true })
  @PropertyType([String])
  selection: Array<string>;

  @Prop()
  otherValue?: string;
}

const SelectionDataPointValueSchema = SchemaFactory.createForClass(SelectionDataPointValue);

@Schema()
export class SelectionDataPoint extends DataPoint<SelectionDataPoint> {
  @Prop({ type: SelectionDataPointValueSchema, required: true })
  @PropertyType(SelectionDataPointValue)
  value: SelectionDataPointValue;
}

export const SelectionDataPointSchema = SchemaFactory.createForClass(SelectionDataPoint);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { DataPoint } from './data-point.schema';
import {
  BaseModel,
  DataPointValueType,
  ISelectionDataPointValue,
  PropertiesOf,
  PropertyType,
  SelectionDataPointModel,
} from '@lyvely/common';
import { NestedSchema } from '@lyvely/core';
import { DataPointSchemaFactory } from '@/time-series/schemas/data-points/data-point-schema.factory';

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
export class SelectionDataPoint
  extends DataPoint<SelectionDataPoint>
  implements PropertiesOf<SelectionDataPointModel>
{
  @Prop({ type: SelectionDataPointValueSchema, required: true })
  @PropertyType(SelectionDataPointValue)
  value: SelectionDataPointValue;

  valueType: typeof DataPointValueType.Selection;
}

export const SelectionDataPointSchema = DataPointSchemaFactory.createForClass(
  DataPointValueType.Selection,
  SelectionDataPoint,
);

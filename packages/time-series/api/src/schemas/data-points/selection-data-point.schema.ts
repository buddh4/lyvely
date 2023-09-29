import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { DataPoint } from './data-point.schema';
import { BaseModel, PropertiesOf, PropertyType } from '@lyvely/common';
import {
  DataPointValueType,
  ISelectionDataPointValue,
  SelectionDataPointModel,
} from '@lyvely/time-series-interface';
import { NestedSchema } from '@lyvely/core';
import { DataPointSchemaFactory } from './data-point-schema.factory';
import { Types } from 'mongoose';

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
  implements PropertiesOf<SelectionDataPointModel<Types.ObjectId>>
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

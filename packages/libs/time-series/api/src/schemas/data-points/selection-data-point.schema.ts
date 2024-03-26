import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { DataPoint } from './data-point.schema';
import { BaseModel, PropertiesOf, PropertyType } from '@lyvely/common';
import {
  DataPointValueType,
  ISelectionDataPointValue,
  SelectionDataPointModel,
} from '@lyvely/time-series-interface';
import {
  BaseDocument,
  BaseDocumentData,
  NestedSchema,
  Profile,
  TObjectId,
  User,
} from '@lyvely/api';
import { DataPointSchemaFactory } from './data-point-schema.factory';
import { TimeSeriesContent } from '../time-series-content.schema';
import { pick } from 'lodash';

@NestedSchema()
export class SelectionDataPointValue implements ISelectionDataPointValue {
  @Prop({ type: [String], required: true })
  @PropertyType([String])
  selection: Array<string>;

  @Prop()
  otherValue?: string;

  constructor(data: PropertiesOf<SelectionDataPointValue>) {
    BaseModel.init(this, data);
  }
}

const SelectionDataPointValueSchema = SchemaFactory.createForClass(SelectionDataPointValue);

@Schema()
export class SelectionDataPoint
  extends DataPoint
  implements PropertiesOf<SelectionDataPointModel<TObjectId>>
{
  @Prop({ type: SelectionDataPointValueSchema, required: true })
  @PropertyType(SelectionDataPointValue)
  override value: SelectionDataPointValue;

  override valueType: typeof DataPointValueType.Selection = DataPointValueType.Selection;

  constructor(
    profile: Profile,
    user: User,
    content: TimeSeriesContent,
    data?: BaseDocumentData<SelectionDataPoint>,
  ) {
    super(profile, user, content, data);
    BaseDocument.init(this, pick(data, 'value'));
  }
}

export const SelectionDataPointSchema = DataPointSchemaFactory.createForClass(
  DataPointValueType.Selection,
  SelectionDataPoint,
);

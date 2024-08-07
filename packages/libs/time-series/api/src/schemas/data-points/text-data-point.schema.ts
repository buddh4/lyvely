import { Prop, Schema } from '@nestjs/mongoose';
import { DataPoint } from './data-point.schema';
import { PropertiesOf, pick } from '@lyvely/common';
import { BaseDocument, BaseDocumentData, Profile, TObjectId, User } from '@lyvely/api';
import { DataPointValueType, TextDataPointModel } from '@lyvely/time-series-interface';
import { DataPointSchemaFactory } from './data-point-schema.factory';
import { TimeSeriesContent } from '../time-series-content.schema';

@Schema()
export class TextDataPoint
  extends DataPoint
  implements PropertiesOf<TextDataPointModel<TObjectId>>
{
  @Prop({ required: true })
  override value: string;

  override valueType: typeof DataPointValueType.Text = DataPointValueType.Text;

  constructor(
    profile: Profile,
    user: User,
    content: TimeSeriesContent,
    data?: BaseDocumentData<TextDataPoint>
  ) {
    super(profile, user, content, data);
    BaseDocument.init(this, pick(data, 'value'));
  }
}

export const TextDataPointSchema = DataPointSchemaFactory.createForClass(
  DataPointValueType.Text,
  TextDataPoint
);

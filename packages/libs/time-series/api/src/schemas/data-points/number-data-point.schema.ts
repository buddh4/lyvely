import { Prop, Schema } from '@nestjs/mongoose';
import { DataPoint } from './data-point.schema';
import { DataPointValueType, NumberDataPointModel } from '@lyvely/time-series-interface';
import { PropertiesOf, PropertyType } from '@lyvely/common';
import { Timer, TimerSchema } from '@lyvely/timers';
import { DataPointSchemaFactory } from './data-point-schema.factory';
import { BaseDocument, BaseDocumentData, Profile, TObjectId, User } from '@lyvely/api';
import { TimeSeriesContent } from '../time-series-content.schema';
import { pick } from 'lodash';

@Schema()
export class NumberDataPoint
  extends DataPoint
  implements PropertiesOf<NumberDataPointModel<TObjectId>>
{
  @Prop({ type: Number, required: true, default: 0 })
  override value: number;

  override valueType: typeof DataPointValueType.Number = DataPointValueType.Number;

  @Prop({ type: TimerSchema })
  @PropertyType(Timer)
  timer?: Timer;

  constructor(
    profile: Profile,
    user: User,
    content: TimeSeriesContent,
    data?: BaseDocumentData<NumberDataPoint>
  ) {
    super(profile, user, content, data);
    BaseDocument.init(this, pick(data, 'value', 'timer'));
  }

  get numericValue() {
    return this.value;
  }

  getTimer() {
    if (!this.timer) {
      this.timer = new Timer();
    }

    return this.timer;
  }
}

export const NumberDataPointSchema = DataPointSchemaFactory.createForClass(
  DataPointValueType.Number,
  NumberDataPoint
);

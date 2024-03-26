import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { DataPoint } from './data-point.schema';
import { BaseModel, PropertiesOf, PropertyType } from '@lyvely/common';
import { DataPointValueType, TimerDataPointModel } from '@lyvely/time-series-interface';
import { Timer, TimerSchema } from '@lyvely/timers';
import {
  User,
  DocumentIdentity,
  NestedSchema,
  TObjectId,
  Profile,
  BaseDocumentData,
  BaseDocument,
} from '@lyvely/api';
import { DataPointSchemaFactory } from './data-point-schema.factory';
import { TimeSeriesContent } from '../time-series-content.schema';
import { pick } from 'lodash';

@NestedSchema()
export class TimerDataPointValue {
  @Prop({ type: TimerSchema, required: true })
  @PropertyType(Timer)
  timer: Timer;

  @Prop({ required: true, default: 0 })
  @PropertyType(Number, { default: 0 })
  ms: number;

  constructor(data: TimerDataPointValue) {
    BaseModel.init(this, data);
  }
}

const TimerDataPointValueSchema = SchemaFactory.createForClass(TimerDataPointValue);

@Schema()
export class TimerDataPoint
  extends DataPoint
  implements PropertiesOf<TimerDataPointModel<TObjectId>>
{
  @Prop({ type: TimerDataPointValueSchema, required: true })
  @PropertyType(TimerDataPointValue)
  override value: TimerDataPointValue;

  override valueType: typeof DataPointValueType.Timer = DataPointValueType.Timer;

  constructor(
    profile: Profile,
    user: User,
    content: TimeSeriesContent,
    data?: BaseDocumentData<TimerDataPoint>,
  ) {
    super(profile, user, content, data);
    BaseDocument.init(this, pick(data, 'value'));
  }

  get numericValue() {
    return this.value.ms;
  }

  isTimerStarted() {
    return this.value.timer.isStarted();
  }

  startTimer(user: DocumentIdentity<User>) {
    return this.value.timer.start(user);
  }

  stopTimer() {
    this.value.timer.stop();
    this.value.ms = this.timer.calculateTotalSpan();
  }

  get timer() {
    return this.value.timer;
  }
}

export const TimerDataPointSchema = DataPointSchemaFactory.createForClass(
  DataPointValueType.Timer,
  TimerDataPoint,
);

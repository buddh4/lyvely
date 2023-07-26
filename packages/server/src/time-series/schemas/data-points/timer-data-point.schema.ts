import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { DataPoint } from './data-point.schema';
import {
  BaseModel,
  DataPointValueType,
  PropertiesOf,
  PropertyType,
  TimerDataPointModel,
} from '@lyvely/common';
import { Timer, TimerSchema } from '@/calendar';
import { EntityIdentity, NestedSchema } from '@lyvely/core';
import { User } from '@/users';
import { DataPointSchemaFactory } from '@/time-series/schemas/data-points/data-point-schema.factory';

@NestedSchema()
export class TimerDataPointValue extends BaseModel<TimerDataPointValue> {
  @Prop({ type: TimerSchema, required: true })
  @PropertyType(Timer)
  timer: Timer;

  @Prop({ required: true, default: 0 })
  @PropertyType(Number, { default: 0 })
  ms: number;
}

const TimerDataPointValueSchema = SchemaFactory.createForClass(TimerDataPointValue);

@Schema()
export class TimerDataPoint
  extends DataPoint<TimerDataPoint>
  implements PropertiesOf<TimerDataPointModel>
{
  @Prop({ type: TimerDataPointValueSchema, required: true })
  @PropertyType(TimerDataPointValue)
  value: TimerDataPointValue;

  valueType: typeof DataPointValueType.Timer;

  afterInit() {
    this.valueType = DataPointValueType.Timer;
  }

  get numericValue() {
    return this.value.ms;
  }

  isTimerStarted() {
    return this.value.timer.isStarted();
  }

  startTimer(user: EntityIdentity<User>) {
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

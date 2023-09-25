import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { DataPoint } from './data-point.schema';
import { BaseModel, PropertiesOf, PropertyType } from '@lyvely/common';
import { DataPointValueType, TimerDataPointModel } from '@lyvely/time-series-interface';
import { Timer, TimerSchema } from '@lyvely/timers';
import { EntityIdentity, NestedSchema } from '@lyvely/core';
import { User } from '@lyvely/users';
import { DataPointSchemaFactory } from './data-point-schema.factory';

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

import { Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { TimerModel, TimeSpanModel } from '@lyvely/timers-interface';
import { PropertyType, PropertiesOf } from '@lyvely/common';
import { assureObjectId, EntityIdentity, NestedSchema, ObjectIdProp } from '@lyvely/core';
import { User } from '@lyvely/users';

@NestedSchema()
export class TimeSpan extends TimeSpanModel implements PropertiesOf<TimeSpanModel> {
  @ObjectIdProp({ immutable: true })
  uid?: mongoose.Types.ObjectId;

  @Prop({ required: true })
  from: number;

  @Prop()
  to?: number;

  constructor(user: EntityIdentity<User>) {
    super(assureObjectId(user));
  }

  afterInit() {
    if (this.uid) {
      this.uid = assureObjectId(this.uid);
    }
  }
}

export const TimeSpanSchema = SchemaFactory.createForClass(TimeSpan);

@NestedSchema()
export class Timer extends TimerModel {
  @ObjectIdProp({ immutable: true })
  uid?: mongoose.Types.ObjectId;

  @Prop({ type: [TimeSpanSchema] })
  @PropertyType([TimeSpan])
  spans: TimeSpan[] = [];

  start(user?: EntityIdentity<User>) {
    return super.start(assureObjectId(user));
  }

  constructor(userIdentity?: EntityIdentity<any>) {
    super();
    if (userIdentity) {
      this.uid = assureObjectId(userIdentity);
    }
  }

  afterInit() {
    if (this.uid) {
      this.uid = assureObjectId(this.uid);
    }
  }
}

export const TimerSchema = SchemaFactory.createForClass(Timer);

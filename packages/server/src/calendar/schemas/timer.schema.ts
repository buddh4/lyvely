import { Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { PropertyType, TimerModel, TimeSpanModel, PropertiesOf } from '@lyvely/common';
import { assureObjectId, EntityIdentity, NestedSchema } from '@lyvely/server-core';
import { User } from '@/users';

@NestedSchema()
export class TimeSpan extends TimeSpanModel implements PropertiesOf<TimeSpanModel> {
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: false, immutable: true })
  uid?: TObjectId;

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
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: false, immutable: true })
  uid?: TObjectId;

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

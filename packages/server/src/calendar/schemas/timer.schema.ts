import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { PropertyType, TimerModel, TimeSpanModel, PropertiesOf } from '@lyvely/common';
import { assureObjectId, EntityIdentity } from '@/core';
import { User } from '@/users';

@Schema({ id: false })
export class TimeSpan implements PropertiesOf<TimeSpanModel> {
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: false, immutable: true })
  uid?: TObjectId;

  @Prop({ required: true })
  from: number;

  @Prop()
  to?: number;

  constructor(userIdentity?: EntityIdentity<User>) {
    if (!this.from) {
      this.from = Date.now();
    }

    if (userIdentity) {
      this.uid = assureObjectId(userIdentity);
    }
  }
}

export const TimeSpanSchema = SchemaFactory.createForClass(TimeSpan);

@Schema({ id: false })
export class Timer extends TimerModel {
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: false, immutable: true })
  uid?: TObjectId;

  @Prop({ type: [TimeSpanSchema] })
  @PropertyType([TimeSpan])
  spans: TimeSpan[] = [];

  constructor(userIdentity?: EntityIdentity<User>) {
    super();
    if (userIdentity) {
      this.uid = assureObjectId(userIdentity);
    }
  }

  clearSpans() {
    this.spans = [];
  }

  start(userIdentity?: EntityIdentity<User>) {
    if (this.isStarted()) return;
    this.spans.push(new TimeSpan(userIdentity));
  }

  stop() {
    const span = this.getLatestSpan();
    if (!span) return;
    span.to = Date.now();
  }
}

export const TimerSchema = SchemaFactory.createForClass(Timer);

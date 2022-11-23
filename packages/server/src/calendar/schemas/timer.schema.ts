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

  start(userIdentity?: EntityIdentity<User>) {
    if (this.isStarted()) return;
    const span = new TimeSpan(userIdentity);
    this.spans.push(span);
    return span;
  }

  stop() {
    const span = this.getLatestSpan();
    if (!span) return;
    span.to = Date.now();
  }

  overwrite(newValue: number, userIdentity?: EntityIdentity<User>) {
    if (newValue === 0) {
      this.spans = [];
      return;
    }

    const currentValueWithoutOpenSpan = this.calculateTotalSpan(false);
    const latestSpan = this.getLatestSpan();
    if (newValue > currentValueWithoutOpenSpan) {
      const diff = newValue - currentValueWithoutOpenSpan;
      if (!this.isStarted()) {
        if (latestSpan) {
          latestSpan.to += diff;
        } else {
          const newSpan = this.start(userIdentity);
          // Todo: This could be a problem when editing old dataPoints without any time spans
          newSpan.from = Date.now() - diff; // This could be a problem when editing old dataPoints without spans
          newSpan.to = newSpan.from + diff;
        }
      } else {
        latestSpan.to = latestSpan.from + diff;
      }
    } else {
      let currentValue = 0;
      const newSpans = [];
      for (let i = 0; i < this.spans.length; i++) {
        const currSpan = this.spans[i];
        const timeSpan = this.calculateSpan(this.spans[i], false);
        if (currentValue + timeSpan >= newValue) {
          currSpan.to = currSpan.from + (newValue - currentValue);
          newSpans.push(currSpan);
          break;
        } else {
          newSpans.push(currSpan);
          currentValue += timeSpan;
        }
      }
      this.spans = newSpans;
    }
  }
}

export const TimerSchema = SchemaFactory.createForClass(Timer);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { PropertyType } from '@lyvely/common';

@Schema({ id: false })
export class TimeSpan {
  @Prop({ required: true })
  from: number;

  @Prop()
  to?: number;

  constructor() {
    if (!this.from) {
      this.from = Date.now();
    }
  }
}

export const TimeSpanSchema = SchemaFactory.createForClass(TimeSpan);

function compareSpans(a: TimeSpan, b: TimeSpan) {
  if (a.from < b.from) return -1;
  if (a.from > b.from) return 1;
  return 0;
}

@Schema({ id: false })
export class Timer {
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: false, immutable: true })
  uid?: TObjectId;

  @Prop({ type: [TimeSpanSchema] })
  @PropertyType([TimeSpan])
  spans: TimeSpan[] = [];

  constructor(uid?: TObjectId) {
    this.uid = uid;
  }

  getLatestSpan() {
    if (!this.spans?.length) return;
    return this.spans.sort(compareSpans)[this.spans.length - 1];
  }

  clearSpans() {
    this.spans = [];
  }

  isStarted() {
    const span = this.getLatestSpan();
    return span && !span.to;
  }

  calculateTotalSpan() {
    return this.spans?.reduce((val, curr) => (curr.to ? val + (curr.to - curr.from) : val), 0) || 0;
  }

  stop() {
    const span = this.getLatestSpan();
    if (!span) return;
    span.to = Date.now();
  }

  start() {
    if (this.getLatestSpan()) return;
    this.spans.push(new TimeSpan());
  }
}

export const TimerSchema = SchemaFactory.createForClass(Timer);

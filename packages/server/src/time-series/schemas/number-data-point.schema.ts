import { Prop } from '@nestjs/mongoose';
import { DataPoint } from './data-point.schema';
import { assureStringId } from '@/core';
import { NumberDataPointModel, PropertyType } from '@lyvely/common';
import { Timer, TimerSchema } from '@/calendar';

export abstract class NumberDataPoint extends DataPoint<NumberDataPoint> {
  @Prop({ type: Number, required: true, default: 0 })
  value: number;

  @Prop({ type: TimerSchema })
  @PropertyType(Timer)
  timer?: Timer;

  afterInit() {
    this.value = this.value ?? 0;
    super.afterInit();
  }

  createDto(): NumberDataPointModel {
    return new NumberDataPointModel({
      id: this.id,
      cid: assureStringId(this.cid),
      uid: this.uid ? assureStringId(this.uid) : undefined,
      timer: this.timer,
      interval: this.interval,
      date: this.date,
      tid: this.tid,
      value: this.value,
    });
  }

  getTimer() {
    if (!this.timer) {
      this.timer = new Timer();
    }

    return this.timer;
  }
}

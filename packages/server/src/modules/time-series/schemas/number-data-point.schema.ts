import { Prop } from '@nestjs/mongoose';
import { DataPoint } from './data-point.schema';
import { assureStringId } from '@/modules/core';
import { NumberDataPointModel } from '@lyvely/common';

export abstract class NumberDataPoint extends DataPoint<NumberDataPoint> {
  @Prop({ type: Number, required: true, default: 0 })
  value: number;

  afterInit() {
    this.value = this.value ?? 0;
    super.afterInit();
  }

  createDto(): NumberDataPointModel {
    return new NumberDataPointModel({
      id: this.id,
      cid: assureStringId(this.cid),
      uid: this.uid ? assureStringId(this.uid) : undefined,
      interval: this.interval,
      date: this.date,
      tid: this.tid,
      value: this.value,
    });
  }
}

import { Prop } from '@nestjs/mongoose';
import { DataPoint } from './data-point.schema';
import { assureStringId } from '@/core';
import { DataPointValueType, PropertyType, TextDataPointModel } from '@lyvely/common';

export abstract class TextDataPoint extends DataPoint<TextDataPoint> {
  @Prop({ required: true })
  value: string;

  @Prop({ default: DataPointValueType.Text })
  @PropertyType(String, { default: DataPointValueType.Text })
  valueType = DataPointValueType.Text;

  createDto(): TextDataPointModel {
    return new TextDataPointModel({
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

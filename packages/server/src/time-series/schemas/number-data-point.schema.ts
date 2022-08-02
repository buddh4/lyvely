import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { DataPoint } from "./data-point.schema";
import mongoose from 'mongoose';
import { assureObjectId, assureStringId, EntityIdentity } from "../../db/db.utils";
import { User } from "../../users";
import { NumberDataPointDto } from "lyvely-common";

export abstract class NumberDataPoint extends DataPoint<NumberDataPoint> {
  @Prop( { type: Number, required: true, default: 0 })
  value: number;

  afterInit() {
    this.value = this.value ?? 0;
    super.afterInit();
  }

  createDto(): NumberDataPointDto {
    return new NumberDataPointDto({
      id: this.id,
      cid: assureStringId(this.cid),
      uid: assureStringId(this.uid),
      interval: this.interval,
      date: this.date,
      tid: this.tid,
      value: this.value
    });
  }
}

@Schema({ _id: false })
export class NumberDataPointUpdate {
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: false })
  uid?: mongoose.Types.ObjectId;

  @Prop({ type: Number, required: true })
  value: number;

  @Prop({ type: Date, required: true })
  updatedAt: Date;

  constructor(uid: EntityIdentity<User>, value: number) {
    this.uid = assureObjectId(uid);
    this.value = value;
    this.updatedAt = new Date();
  }

  static createByDataPointUpdate(uid: EntityIdentity<User>, dataPoint: NumberDataPoint, newValue: number) {
    return new NumberDataPointUpdate(uid,newValue - dataPoint.value);
  }
}

const DataPointTimingSchema = SchemaFactory.createForClass(NumberDataPointUpdate);

export abstract class TimedNumberDataPoint extends NumberDataPoint {
  @Prop({ type: [DataPointTimingSchema] })
  history?: NumberDataPointUpdate[];

  afterInit() {
    this.history = this.history || [];
    super.afterInit();
  }
}




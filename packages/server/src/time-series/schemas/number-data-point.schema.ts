import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { DataPoint } from "./data-point.schema";
import mongoose from 'mongoose';
import { assureObjectId, EntityIdentity } from "../../db/db.utils";
import { User } from "../../users";

export abstract class NumberDataPoint extends DataPoint<NumberDataPoint> {
  @Prop( { type: Number, required: true, default: 0 })
  value: number;

  afterInit() {
    this.value = this.value ?? 0;
    super.afterInit();
  }
}

@Schema({ _id: false })
export class DataPointUpdate {
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
    return new DataPointUpdate(uid,newValue - dataPoint.value);
  }
}

const DataPointTimingSchema = SchemaFactory.createForClass(DataPointUpdate);

export abstract class TimedNumberDataPoint extends NumberDataPoint {
  @Prop({ type: [DataPointTimingSchema] })
  history?: DataPointUpdate[];

  afterInit() {
    this.history = this.history || [];
    super.afterInit();
  }
}




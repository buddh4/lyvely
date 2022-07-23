import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { DataPoint } from "../../time-series";

@Schema({ timestamps: true })
export class HabitDataPoint extends DataPoint<HabitDataPoint> {
  @Prop({ required: true })
  value: number;

  afterInit() {
    super.afterInit();
    this.value = this.value || 0;
  }
}

export const ActivityDataPointSchema = SchemaFactory.createForClass(HabitDataPoint);
export type HabitDataPointDocument = HabitDataPoint & mongoose.Document;

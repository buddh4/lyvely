import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { CalendarIntervalEnum, ITiming , getNumberEnumValues } from 'lyvely-common';


export type TimingDocument = Timing & mongoose.Document;

@Schema()
export class Timing implements ITiming {
  @Prop({ required: true })
  _id: string;

  @Prop({ required: true })
  timingId: string;

  @Prop()
  dayOfMonth: number;

  @Prop()
  monthOfYear: number;

  @Prop()
  year: number;

  @Prop()
  date: Date;

  @Prop()
  dayOfWeek: number; // note Su = 0

  @Prop()
  isoWeekOfYear: number;

  @Prop({ enum: getNumberEnumValues(CalendarIntervalEnum), required: true })
  interval: CalendarIntervalEnum;

  @Prop({ min: 1, max: 4 })
  quarter: number;

  constructor(id: string, plan: number) {
    this._id = id;
    this.timingId = id;
    this.interval = plan;
  }
}

export const TimingSchema = SchemaFactory.createForClass(Timing);

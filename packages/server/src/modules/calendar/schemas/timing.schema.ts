import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { CalendarIntervalEnum, ITiming, getNumberEnumValues } from '@lyvely/common';

@Schema()
export class Timing implements ITiming {
  @Prop({ required: true })
  _id: string;

  @Prop({ required: true })
  tid: string;

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
    this.tid = id;
    this.interval = plan;
  }
}

export const TimingSchema = SchemaFactory.createForClass(Timing);

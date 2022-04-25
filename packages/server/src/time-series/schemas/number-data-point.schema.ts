import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { dateTime, isToday } from "lyvely-common/src";
import { DataPoint } from "./time-series-data-point.schema";

@Schema({ _id: false })
export class DataPointTiming {
  @Prop({ type: Number, required: true, min: 0 })
  ts: number;

  @Prop({ type: Number, required: true })
  value: number;

  constructor(ts: number, value: number) {
    this.ts = ts;
    this.value = value;
  }
}

const DataPointTimingSchema = SchemaFactory.createForClass(DataPointTiming);

export abstract class NumberDataPoint extends DataPoint {

  @Prop( { type: Number, required: true })
  value: number;

  @Prop({ type: [DataPointTimingSchema] })
  times?: DataPointTiming[];

  afterInit() {
    this.value = this.value || 0;

    // Call before parent.afterInit due to full date transformation in afterInit
    if(this.date && !this.times?.length && this.value) {
      const ts = isToday(this.date) ? dateTime(this.date).unixTs() : dateTime(this.date).time(23, 59, 59).unixTs();
      this.times = [new DataPointTiming(ts, this.value)];
    }



    super.afterInit();
  }
}




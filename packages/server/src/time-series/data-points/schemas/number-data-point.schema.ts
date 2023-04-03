import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { DataPoint } from './data-point.schema';
import { DataPointValueType, PropertyType } from '@lyvely/common';
import { Timer, TimerSchema } from '@/calendar';

@Schema()
export class NumberDataPoint extends DataPoint<NumberDataPoint> {
  @Prop({ type: Number, required: true, default: 0 })
  value: number;

  @Prop({ type: TimerSchema })
  @PropertyType(Timer)
  timer?: Timer;

  afterInit() {
    this.value = this.value ?? 0;
    this.valueType = DataPointValueType.Number;
    super.afterInit();
  }

  getTimer() {
    if (!this.timer) {
      this.timer = new Timer();
    }

    return this.timer;
  }
}

export const NumberDataPointSchema = SchemaFactory.createForClass(NumberDataPoint);

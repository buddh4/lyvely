import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { DataPoint } from './data-point.schema';
import { DataPointValueType, NumberDataPointModel, PropertyType } from '@lyvely/common';
import { Timer, TimerSchema } from '@/calendar';

export abstract class NumberDataPoint extends DataPoint<NumberDataPoint, NumberDataPointModel> {
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

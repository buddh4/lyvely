import { Prop, Schema } from '@nestjs/mongoose';
import { DataPoint } from './data-point.schema';
import {
  DataPointValueType,
  NumberDataPointModel,
  PropertiesOf,
  PropertyType,
} from '@lyvely/common';
import { Timer, TimerSchema } from '@/calendar';
import { DataPointSchemaFactory } from '@/time-series/schemas/data-points/data-point-schema.factory';

@Schema()
export class NumberDataPoint
  extends DataPoint<NumberDataPoint>
  implements PropertiesOf<NumberDataPointModel>
{
  @Prop({ type: Number, required: true, default: 0 })
  value: number;

  @Prop({ type: TimerSchema })
  @PropertyType(Timer)
  timer?: Timer;

  valueType: typeof DataPointValueType.Number;

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

export const NumberDataPointSchema = DataPointSchemaFactory.createForClass(
  DataPointValueType.Number,
  NumberDataPoint,
);

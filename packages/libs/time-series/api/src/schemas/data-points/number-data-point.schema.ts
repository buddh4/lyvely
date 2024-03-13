import { Prop, Schema } from '@nestjs/mongoose';
import { DataPoint } from './data-point.schema';
import { DataPointValueType, NumberDataPointModel } from '@lyvely/time-series-interface';
import { PropertiesOf, PropertyType } from '@lyvely/common';
import { Timer, TimerSchema } from '@lyvely/timers';
import { DataPointSchemaFactory } from './data-point-schema.factory';
import { TObjectId } from '@lyvely/api';

@Schema()
export class NumberDataPoint
  extends DataPoint
  implements PropertiesOf<NumberDataPointModel<TObjectId>>
{
  @Prop({ type: Number, required: true, default: 0 })
  override value = 0;

  override valueType: typeof DataPointValueType.Number = DataPointValueType.Number;

  @Prop({ type: TimerSchema })
  @PropertyType(Timer)
  timer?: Timer;

  get numericValue() {
    return this.value;
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

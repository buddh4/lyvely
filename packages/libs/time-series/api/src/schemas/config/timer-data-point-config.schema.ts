import { Prop, SchemaFactory } from '@nestjs/mongoose';
import {
  DataPointInputType,
  DataPointValueType,
  ITimerDataPointConfig,
  ITimerDataPointSettings,
  ITimerDataPointConfigRevision,
} from '@lyvely/time-series-interface';
import { DataPointConfig, DataPointConfigRevision } from './data-point-config.schema';
import { pick } from 'lodash';
import { NestedSchema } from '@lyvely/api';
import { DataPointConfigFactory } from '../data-point-config.factory';
import { DataPointConfigSchemaFactory } from '../data-point-config-schema.factory';

const strategy = DataPointConfigFactory.getStrategyName(
  DataPointValueType.Timer,
  DataPointInputType.Timer
);

@NestedSchema()
export class TimerDataPointConfigRevision
  extends DataPointConfigRevision
  implements ITimerDataPointConfigRevision
{
  @Prop()
  min?: number;

  @Prop()
  max?: number;

  @Prop()
  optimal?: number;

  constructor(config: ITimerDataPointConfig) {
    super(config);
    this.valueType = DataPointValueType.Timer;
    this.inputType = DataPointInputType.Timer;
    this.min = config.min;
    this.max = config.max;
    this.optimal = config.optimal;
  }
}

export const TimerDataPointConfigRevisionSchema = SchemaFactory.createForClass(
  TimerDataPointConfigRevision
);

@NestedSchema({ discriminatorKey: 'strategy' })
export class TimerDataPointConfig
  extends DataPointConfig<ITimerDataPointSettings>
  implements ITimerDataPointConfig
{
  override strategy = strategy;

  @Prop({
    type: String,
    enum: [DataPointValueType.Timer],
    required: true,
    default: DataPointValueType.Timer,
  })
  override valueType: typeof DataPointValueType.Timer = DataPointValueType.Timer;

  @Prop({ enum: [DataPointInputType.Timer] })
  override inputType: DataPointInputType.Timer = DataPointInputType.Timer;

  @Prop({ type: [TimerDataPointConfigRevisionSchema], default: [] })
  override history: TimerDataPointConfigRevision[];

  @Prop()
  min?: number;

  @Prop()
  max?: number;

  @Prop()
  optimal?: number;

  constructor(settings?: ITimerDataPointSettings) {
    super(DataPointValueType.Timer, DataPointInputType.Timer, settings);
    this.min ??= settings?.min;
    this.max ??= settings?.max;
    this.optimal ??= settings?.optimal;
  }

  setSettings(settings?: ITimerDataPointSettings) {
    Object.assign(this, pick(settings, ['min', 'max', 'optimal', 'interval', 'userStrategy']));
  }

  getSettings() {
    const { min, max, optimal, interval, userStrategy } = this;
    return { min, max, optimal, interval, userStrategy };
  }
}

export const TimerDataPointConfigSchema = DataPointConfigSchemaFactory.createForClass(
  strategy,
  TimerDataPointConfig
);

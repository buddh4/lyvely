import { Prop, SchemaFactory } from '@nestjs/mongoose';
import {
  DataPointInputType,
  DataPointValueType,
  INumberDataPointConfig,
  INumberDataPointSettings,
  INumberDataPointConfigRevision,
} from '@lyvely/time-series-interface';
import { DataPointConfig, DataPointConfigRevision } from './data-point-config.schema';
import { pick } from '@lyvely/common';
import { NestedSchema } from '@lyvely/api';

@NestedSchema()
export class NumberDataPointConfigRevision
  extends DataPointConfigRevision
  implements INumberDataPointConfigRevision
{
  @Prop()
  min?: number;

  @Prop()
  max?: number;

  @Prop()
  optimal?: number;

  constructor(config: INumberDataPointConfig) {
    super(config);
    this.valueType = DataPointValueType.Number;
    this.min = config.min;
    this.max = config.max;
    this.optimal = config.optimal;
  }
}

export const NumberDataPointConfigRevisionSchema = SchemaFactory.createForClass(
  NumberDataPointConfigRevision
);

const SupportedNumberDataPointInputTypes = [
  DataPointInputType.Spinner,
  DataPointInputType.Range,
  DataPointInputType.Checkbox,
];

@NestedSchema({ discriminatorKey: 'strategy' })
export class NumberDataPointConfig
  extends DataPointConfig<INumberDataPointSettings>
  implements INumberDataPointConfig
{
  @Prop({
    type: String,
    enum: [DataPointValueType.Number],
    required: true,
    default: DataPointValueType.Number,
  })
  override valueType: typeof DataPointValueType.Number = DataPointValueType.Number;

  @Prop({ enum: SupportedNumberDataPointInputTypes })
  override inputType: DataPointInputType;

  @Prop({ type: [NumberDataPointConfigRevisionSchema], default: [] })
  override history: NumberDataPointConfigRevision[];

  @Prop()
  min?: number;

  @Prop()
  max?: number;

  @Prop()
  optimal?: number;

  constructor(inputType?: DataPointInputType, settings?: INumberDataPointSettings) {
    super(DataPointValueType.Number, inputType!, settings);
    this.min = settings?.min;
    this.max = settings?.max;
    this.optimal = settings?.optimal;
  }

  setSettings(settings?: INumberDataPointSettings) {
    Object.assign(this, pick(settings, 'min', 'max', 'optimal', 'interval', 'userStrategy'));
  }

  getSettings() {
    const { min, max, optimal, interval, userStrategy } = this;
    return { min, max, optimal, interval, userStrategy };
  }
}

export const NumberDataPointConfigSchema = SchemaFactory.createForClass(NumberDataPointConfig);

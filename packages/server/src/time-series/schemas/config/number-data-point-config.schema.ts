import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  DataPointInputType,
  DataPointValueType,
  INumberDataPointConfig,
  INumberDataPointSettings,
  INumberDataPointConfigRevision,
} from '@lyvely/common';
import { DataPointConfig, DataPointConfigRevision } from './data-point-config.schema';

@Schema({ _id: false })
export class NumberDataPointConfigRevision extends DataPointConfigRevision implements INumberDataPointConfigRevision {
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

export const NumberDataPointConfigRevisionSchema = SchemaFactory.createForClass(NumberDataPointConfigRevision);

const SupportedNumberDataPointInputTypes = [
  DataPointInputType.Time,
  DataPointInputType.Spinner,
  DataPointInputType.Range,
  DataPointInputType.Checkbox,
  DataPointInputType.Textarea,
];

@Schema({ _id: false, discriminatorKey: 'strategy' })
export class NumberDataPointConfig extends DataPointConfig<INumberDataPointSettings> implements INumberDataPointConfig {
  @Prop({ enum: [DataPointValueType.Number], required: true, default: DataPointValueType.Number })
  valueType: DataPointValueType.Number = DataPointValueType.Number;

  @Prop({ enum: SupportedNumberDataPointInputTypes })
  inputType: DataPointInputType;

  @Prop()
  min?: number;

  @Prop()
  max?: number;

  @Prop()
  optimal?: number;

  @Prop({ type: [NumberDataPointConfigRevisionSchema], default: [] })
  history: NumberDataPointConfigRevision[];

  constructor(inputType?: DataPointInputType, settings?: INumberDataPointSettings) {
    super(DataPointValueType.Number, inputType, settings);
  }

  setSettings(settings?: INumberDataPointSettings) {
    Object.assign(this, settings);
  }

  getSettings() {
    const { min, max, optimal, interval } = this;
    return { min, max, optimal, interval };
  }
}

export const NumberDataPointConfigSchema = SchemaFactory.createForClass(NumberDataPointConfig);

import { Prop, SchemaFactory } from '@nestjs/mongoose';
import {
  DataPointInputType,
  DataPointValueType,
  INumberDataPointSettings,
  INumberDataPointConfig,
} from '@lyvely/common';
import { DataPointConfig, DataPointConfigRevision } from './data-point-config.schema';

export class NumberDataPointConfigRevision extends DataPointConfigRevision implements INumberDataPointSettings {
  @Prop()
  min?: number;

  @Prop()
  max?: number;

  @Prop()
  optimal?: number;

  constructor(config: INumberDataPointConfig) {
    super(config);
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

export class NumberDataPointConfig
  extends DataPointConfig<INumberDataPointSettings>
  implements INumberDataPointSettings
{
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
    this.min = settings?.min;
    this.max = settings?.max;
    this.optimal = settings?.optimal;
  }

  getSettings() {
    const { min, max, optimal, interval } = this;
    return { min, max, optimal, interval };
  }
}

export const NumberDataPointConfigSchema = SchemaFactory.createForClass(NumberDataPointConfig);

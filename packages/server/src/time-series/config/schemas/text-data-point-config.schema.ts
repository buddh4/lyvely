import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  DataPointInputType,
  DataPointValueType,
  INumberDataPointSettings,
  ITextDataPointConfig,
  PropertyType,
  ITextDataPointConfigRevision,
  ITextDataPointSettings,
} from '@lyvely/common';
import { DataPointConfig, DataPointConfigRevision } from './data-point-config.schema';
import { NestedSchema } from '@/core';

const SupportedTextDataPointInputTypes = [DataPointInputType.Textarea];

@NestedSchema()
export class TextDataPointConfigRevision
  extends DataPointConfigRevision
  implements ITextDataPointConfigRevision
{
  @Prop({ default: false })
  required?: boolean;

  constructor(config: ITextDataPointConfig) {
    super(config);
    this.valueType = DataPointValueType.Text;
    this.required = config.required;
  }
}

export const TextDataPointConfigRevisionSchema = SchemaFactory.createForClass(
  TextDataPointConfigRevision,
);

@Schema({ _id: false, discriminatorKey: 'strategy' })
export class TextDataPointConfig
  extends DataPointConfig<ITextDataPointSettings>
  implements ITextDataPointConfig
{
  @Prop({ enum: [DataPointValueType.Text], required: true, default: DataPointValueType.Text })
  @PropertyType(String, { default: DataPointValueType.Text })
  valueType: DataPointValueType.Text = DataPointValueType.Text;

  @Prop({ enum: SupportedTextDataPointInputTypes })
  inputType: DataPointInputType;

  @Prop()
  required?: boolean;

  @Prop({ type: [TextDataPointConfigRevisionSchema], default: [] })
  history: TextDataPointConfigRevision[];

  constructor(inputType?: DataPointInputType, settings?: ITextDataPointSettings) {
    super(DataPointValueType.Text, inputType, settings);
  }

  setSettings(settings?: INumberDataPointSettings) {
    Object.assign(this, settings);
  }

  getSettings() {
    const { required, interval } = this;
    return { required, interval };
  }
}

export const TextDataPointConfigSchema = SchemaFactory.createForClass(TextDataPointConfig);

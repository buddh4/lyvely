import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  DataPointInputType,
  DataPointValueType,
  ITextDataPointConfig,
  PropertyType,
  ITextDataPointConfigRevision,
  ITextDataPointSettings,
} from '@lyvely/common';
import { DataPointConfig, DataPointConfigRevision } from './data-point-config.schema';
import { NestedSchema } from '@/core';
import { pick } from 'lodash';

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

  @Prop({ default: false })
  required: boolean;

  @Prop({ type: [TextDataPointConfigRevisionSchema], default: [] })
  history: TextDataPointConfigRevision[];

  constructor(inputType?: DataPointInputType, settings?: ITextDataPointSettings) {
    super(DataPointValueType.Text, inputType, settings);
  }

  getSettings(): ITextDataPointSettings {
    return pick(this, ['interval', 'userStrategy', 'required']);
  }

  setSettings(settings: ITextDataPointSettings) {
    Object.assign(this, pick(settings, ['interval', 'userStrategy', 'required']));
  }
}

export const TextDataPointConfigSchema = SchemaFactory.createForClass(TextDataPointConfig);

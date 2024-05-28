import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  DataPointInputType,
  DataPointValueType,
  ITextDataPointConfig,
  ITextDataPointConfigRevision,
  ITextDataPointSettings,
} from '@lyvely/time-series-interface';
import { PropertyType } from '@lyvely/common';
import { DataPointConfig, DataPointConfigRevision } from './data-point-config.schema';
import { NestedSchema } from '@lyvely/api';
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
  TextDataPointConfigRevision
);

@Schema({ _id: false, discriminatorKey: 'strategy' })
export class TextDataPointConfig
  extends DataPointConfig<ITextDataPointSettings>
  implements ITextDataPointConfig
{
  @Prop({
    type: String,
    enum: [DataPointValueType.Text],
    required: true,
    default: DataPointValueType.Text,
  })
  @PropertyType(String, { default: DataPointValueType.Text })
  override valueType: typeof DataPointValueType.Text = DataPointValueType.Text;

  @Prop({ enum: SupportedTextDataPointInputTypes })
  override inputType: DataPointInputType;

  @Prop({ type: [TextDataPointConfigRevisionSchema], default: [] })
  override history: TextDataPointConfigRevision[];

  @Prop({ default: false })
  required: boolean;

  constructor(inputType?: DataPointInputType, settings?: ITextDataPointSettings) {
    super(DataPointValueType.Text, inputType!, settings);
    this.required ??= settings?.required || false;
  }

  getSettings(): ITextDataPointSettings {
    return pick(this, ['interval', 'userStrategy', 'required']);
  }

  setSettings(settings: ITextDataPointSettings) {
    Object.assign(this, pick(settings, ['interval', 'userStrategy', 'required']));
  }
}

export const TextDataPointConfigSchema = SchemaFactory.createForClass(TextDataPointConfig);

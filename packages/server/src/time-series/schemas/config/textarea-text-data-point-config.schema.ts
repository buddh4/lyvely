import { Prop, Schema } from '@nestjs/mongoose';
import { DataPointInputType, DataPointValueType } from '@lyvely/common';
import { DataPointConfigSchemaFactory } from './data-point-config-schema.factory';
import { DefaultDataPointConfig } from './data-point-config.schema';
import { DataPointConfigFactory } from './data-point-config.factory';

const strategy = DataPointConfigFactory.getStrategyName(
  DataPointValueType.Text,
  DataPointInputType.Textarea,
);

@Schema()
export class TextareaTextDataPointConfig extends DefaultDataPointConfig {
  strategy = strategy;

  @Prop({ enum: [DataPointValueType.Text], required: true, default: DataPointValueType.Text })
  valueType: DataPointValueType.Text = DataPointValueType.Text;

  @Prop({ enum: [DataPointInputType.Textarea], required: true, default: DataPointValueType.Text })
  inputType: DataPointInputType = DataPointInputType.Textarea;

  constructor() {
    super(DataPointValueType.Text, DataPointInputType.Textarea);
  }
}

export const TextareaTextDataPointConfigSchema = DataPointConfigSchemaFactory.createForClass(
  strategy,
  TextareaTextDataPointConfig,
);

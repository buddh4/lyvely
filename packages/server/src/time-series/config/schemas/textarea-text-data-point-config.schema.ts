import { Prop, Schema } from '@nestjs/mongoose';
import { DataPointInputType, DataPointValueType } from '@lyvely/common';
import { DataPointConfigSchemaFactory, DataPointConfigFactory } from '../components';
import { TextDataPointConfig } from './text-data-point-config.schema';
import { NestedSchema } from '@/core';

const strategy = DataPointConfigFactory.getStrategyName(
  DataPointValueType.Text,
  DataPointInputType.Textarea,
);

@NestedSchema()
export class TextareaTextDataPointConfig extends TextDataPointConfig {
  strategy = strategy;

  @Prop({ enum: [DataPointValueType.Text], required: true, default: DataPointValueType.Text })
  valueType: DataPointValueType.Text = DataPointValueType.Text;

  @Prop({ enum: [DataPointInputType.Textarea], required: true, default: DataPointValueType.Text })
  inputType: DataPointInputType = DataPointInputType.Textarea;
}

export const TextareaTextDataPointConfigSchema = DataPointConfigSchemaFactory.createForClass(
  strategy,
  TextareaTextDataPointConfig,
);

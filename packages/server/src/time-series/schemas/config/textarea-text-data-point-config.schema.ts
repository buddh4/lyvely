import { Prop } from '@nestjs/mongoose';
import { DataPointInputType, DataPointValueType, ITextDataPointSettings } from '@lyvely/common';
import { DataPointConfigFactory, DataPointConfigSchemaFactory } from '../../components';
import { TextDataPointConfig } from './text-data-point-config.schema';
import { NestedSchema } from '@/core';

const strategy = DataPointConfigFactory.getStrategyName(
  DataPointValueType.Text,
  DataPointInputType.Textarea,
);

@NestedSchema()
export class TextareaTextDataPointConfig extends TextDataPointConfig {
  strategy = strategy;

  @Prop({
    enum: [DataPointInputType.Textarea],
    required: true,
    default: DataPointInputType.Textarea,
  })
  inputType: DataPointInputType = DataPointInputType.Textarea;

  constructor(settings: Omit<ITextDataPointSettings, 'inputType'>) {
    super(DataPointInputType.Textarea, settings);
  }
}

export const TextareaTextDataPointConfigSchema = DataPointConfigSchemaFactory.createForClass(
  strategy,
  TextareaTextDataPointConfig,
);

import { Prop } from '@nestjs/mongoose';
import {
  DataPointInputType,
  DataPointValueType,
  ITextDataPointSettings,
} from '@lyvely/time-series-interface';
import { DataPointConfigFactory } from '../data-point-config.factory';
import { DataPointConfigSchemaFactory } from '../data-point-config-schema.factory';
import { TextDataPointConfig } from './text-data-point-config.schema';
import { NestedSchema } from '@lyvely/api';

const strategy = DataPointConfigFactory.getStrategyName(
  DataPointValueType.Text,
  DataPointInputType.Textarea,
);

@NestedSchema()
export class TextareaTextDataPointConfig extends TextDataPointConfig {
  override strategy = strategy;

  @Prop({
    enum: [DataPointInputType.Textarea],
    required: true,
    default: DataPointInputType.Textarea,
  })
  override inputType: DataPointInputType = DataPointInputType.Textarea;

  constructor(settings: Omit<ITextDataPointSettings, 'inputType'>) {
    super(DataPointInputType.Textarea, settings);
  }
}

export const TextareaTextDataPointConfigSchema = DataPointConfigSchemaFactory.createForClass(
  strategy,
  TextareaTextDataPointConfig,
);

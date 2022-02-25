import { Prop, Schema } from '@nestjs/mongoose';
import { DataPointInputType, DataPointInputStrategy, DataPointValueType } from 'lyvely-common';
import { DataPointConfigSchemaFactory } from './data-point-config-schema.factory';
import { TimeSeriesDataPointConfig } from './time-series-data-point-config.schema';

@Schema()
export class TextareaTextDataPointConfig extends TimeSeriesDataPointConfig {

  strategy = DataPointInputStrategy.TextareaText;

  @Prop({ enum: [DataPointInputType.Textarea] })
  inputType: DataPointInputType = DataPointInputType.Textarea;

  constructor() {
    super(DataPointValueType.Text, DataPointInputType.Textarea);
  }
}

export const TextareaTextDataPointConfigSchema
  = DataPointConfigSchemaFactory.createForClass(DataPointInputStrategy.TextareaText, TextareaTextDataPointConfig);


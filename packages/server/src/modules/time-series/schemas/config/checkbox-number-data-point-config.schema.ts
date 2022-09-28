import { Prop, Schema } from '@nestjs/mongoose';
import { NumberDataPointConfig } from './number-data-point-config.schema';
import { DataPointInputType, DataPointInputStrategy, INumberDataPointSettings } from '@lyvely/common';
import { DataPointConfigSchemaFactory } from './data-point-config-schema.factory';

@Schema()
export class CheckboxNumberDataPointConfig extends NumberDataPointConfig {
  strategy = DataPointInputStrategy.CheckboxNumber;

  @Prop({ enum: [DataPointInputType.Checkbox] })
  inputType: DataPointInputType;

  constructor(settings: INumberDataPointSettings) {
    super(DataPointInputType.Checkbox, settings);
  }
}

export const CheckboxNumberDataPointConfigSchema = DataPointConfigSchemaFactory.createForClass(
  DataPointInputStrategy.CheckboxNumber,
  CheckboxNumberDataPointConfig,
);

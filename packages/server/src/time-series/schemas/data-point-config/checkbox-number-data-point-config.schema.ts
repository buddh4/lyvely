import { Prop, Schema } from '@nestjs/mongoose';
import { AbstractNumberDataPointConfig } from './abstract-number-data-point-config.schema';
import { DataPointInputType, DataPointInputStrategy, NumberDataPointSettings } from 'lyvely-common';
import { DataPointConfigSchemaFactory } from './data-point-config-schema.factory';

@Schema()
export class CheckboxNumberDataPointConfig extends AbstractNumberDataPointConfig {

  strategy = DataPointInputStrategy.CheckboxNumber;

  @Prop({ enum: [DataPointInputType.Checkbox] })
  inputType: DataPointInputType;

  constructor(settings: NumberDataPointSettings) {
    super(DataPointInputType.Checkbox, settings);
  }
}

export const CheckboxNumberDataPointConfigSchema
  = DataPointConfigSchemaFactory.createForClass(DataPointInputStrategy.CheckboxNumber, CheckboxNumberDataPointConfig);
import { Prop, Schema } from '@nestjs/mongoose';
import { DataPointInputType, DataPointInputStrategy, NumberDataPointSettings } from 'lyvely-common';
import { AbstractNumberDataPointConfig } from './abstract-number-data-point-config.schema';
import { DataPointConfigSchemaFactory } from './data-point-config-schema.factory';

@Schema()
export class SpinnerNumberDataPointConfig extends AbstractNumberDataPointConfig {

  strategy = DataPointInputStrategy.SpinnerNumber;

  @Prop({ enum: [DataPointInputType.Spinner] })
  inputType: DataPointInputType;

  constructor(settings: NumberDataPointSettings) {
    super(DataPointInputType.Spinner, settings);
  }
}

export const SpinnerNumberDataPointConfigSchema
  = DataPointConfigSchemaFactory.createForClass(DataPointInputStrategy.SpinnerNumber, SpinnerNumberDataPointConfig);


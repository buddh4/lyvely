import { Prop, Schema } from '@nestjs/mongoose';
import { DataPointInputType, DataPointInputStrategy, NumberDataPointSettings } from 'lyvely-common';
import { AbstractNumberDataPointConfig } from './abstract-number-data-point-config.schema';
import { DataPointConfigSchemaFactory } from './data-point-config-schema.factory';

@Schema()
export class RangeNumberDataPointConfig extends AbstractNumberDataPointConfig {

  strategy = DataPointInputStrategy.RangeNumber;

  @Prop({ enum: [DataPointInputType.Range] })
  inputType: DataPointInputType;

  constructor(settings: NumberDataPointSettings) {
    super(DataPointInputType.Range, settings);
  }
}

export const RangeNumberDataPointConfigSchema
  = DataPointConfigSchemaFactory.createForClass(DataPointInputStrategy.RangeNumber, RangeNumberDataPointConfig);
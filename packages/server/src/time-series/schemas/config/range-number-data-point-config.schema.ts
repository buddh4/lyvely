import { Prop, Schema } from '@nestjs/mongoose';
import { DataPointInputType, DataPointInputStrategy, INumberDataPointSettings } from '@lyvely/common';
import { NumberDataPointConfig } from './number-data-point-config.schema';
import { DataPointConfigSchemaFactory } from './data-point-config-schema.factory';

@Schema()
export class RangeNumberDataPointConfig extends NumberDataPointConfig {
  strategy = DataPointInputStrategy.RangeNumber;

  @Prop({ enum: [DataPointInputType.Range] })
  inputType: DataPointInputType;

  constructor(settings: INumberDataPointSettings) {
    super(DataPointInputType.Range, settings);
  }
}

export const RangeNumberDataPointConfigSchema = DataPointConfigSchemaFactory.createForClass(
  DataPointInputStrategy.RangeNumber,
  RangeNumberDataPointConfig,
);

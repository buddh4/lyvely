import { Prop, Schema } from '@nestjs/mongoose';
import { DataPointInputType, INumberDataPointSettings, DataPointValueType } from '@lyvely/common';
import { NumberDataPointConfig } from './number-data-point-config.schema';
import { DataPointConfigSchemaFactory } from './data-point-config-schema.factory';
import { DataPointConfigFactory } from './data-point-config.factory';

const strategy = DataPointConfigFactory.getStrategyName(DataPointValueType.Number, DataPointInputType.Spinner);

@Schema()
export class SpinnerNumberDataPointConfig extends NumberDataPointConfig {
  strategy = strategy;

  @Prop({ enum: [DataPointInputType.Spinner] })
  inputType: DataPointInputType;

  constructor(settings: INumberDataPointSettings) {
    super(DataPointInputType.Spinner, settings);
  }
}

export const SpinnerNumberDataPointConfigSchema = DataPointConfigSchemaFactory.createForClass(
  strategy,
  SpinnerNumberDataPointConfig,
);

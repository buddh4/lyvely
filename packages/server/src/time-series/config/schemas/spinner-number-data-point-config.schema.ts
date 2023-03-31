import { Prop } from '@nestjs/mongoose';
import { DataPointInputType, INumberDataPointSettings, DataPointValueType } from '@lyvely/common';
import { NumberDataPointConfig } from './number-data-point-config.schema';
import { DataPointConfigSchemaFactory } from '../components/data-point-config-schema.factory';
import { DataPointConfigFactory } from '../components/data-point-config.factory';
import { NestedSchema } from '@/core';

const strategy = DataPointConfigFactory.getStrategyName(
  DataPointValueType.Number,
  DataPointInputType.Spinner,
);

@NestedSchema()
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

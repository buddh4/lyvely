import { Prop } from '@nestjs/mongoose';
import {
  DataPointInputType,
  INumberDataPointSettings,
  DataPointValueType,
} from '@lyvely/time-series-interface';
import { NumberDataPointConfig } from './number-data-point-config.schema';
import { DataPointConfigFactory } from '../data-point-config.factory';
import { DataPointConfigSchemaFactory } from '../data-point-config-schema.factory';
import { NestedSchema } from '@lyvely/core';

const strategy = DataPointConfigFactory.getStrategyName(
  DataPointValueType.Number,
  DataPointInputType.Spinner,
);

@NestedSchema()
export class SpinnerNumberDataPointConfig extends NumberDataPointConfig {
  strategy = strategy;

  @Prop({ enum: [DataPointInputType.Spinner] })
  inputType: DataPointInputType;

  constructor(settings: Omit<INumberDataPointSettings, 'inputType'>) {
    super(DataPointInputType.Spinner, settings);
  }
}

export const SpinnerNumberDataPointConfigSchema = DataPointConfigSchemaFactory.createForClass(
  strategy,
  SpinnerNumberDataPointConfig,
);
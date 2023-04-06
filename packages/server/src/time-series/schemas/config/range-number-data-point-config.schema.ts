import { Prop } from '@nestjs/mongoose';
import { DataPointInputType, INumberDataPointSettings, DataPointValueType } from '@lyvely/common';
import { NumberDataPointConfig } from './number-data-point-config.schema';
import { DataPointConfigFactory } from '../data-point-config.factory';
import { DataPointConfigSchemaFactory } from '../data-point-config-schema.factory';
import { NestedSchema } from '@/core';

const strategy = DataPointConfigFactory.getStrategyName(
  DataPointValueType.Number,
  DataPointInputType.Range,
);

@NestedSchema()
export class RangeNumberDataPointConfig extends NumberDataPointConfig {
  strategy = strategy;

  @Prop({ enum: [DataPointInputType.Range] })
  inputType: DataPointInputType;

  constructor(settings: Omit<INumberDataPointSettings, 'inputType'>) {
    super(DataPointInputType.Range, settings);
  }
}

export const RangeNumberDataPointConfigSchema = DataPointConfigSchemaFactory.createForClass(
  strategy,
  RangeNumberDataPointConfig,
);

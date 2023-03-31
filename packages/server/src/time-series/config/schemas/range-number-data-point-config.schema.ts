import { Prop, Schema } from '@nestjs/mongoose';
import { DataPointInputType, INumberDataPointSettings, DataPointValueType } from '@lyvely/common';
import { NumberDataPointConfig } from './number-data-point-config.schema';
import { DataPointConfigSchemaFactory } from '../components/data-point-config-schema.factory';
import { DataPointConfigFactory } from '../components/data-point-config.factory';
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

  constructor(settings: INumberDataPointSettings) {
    super(DataPointInputType.Range, settings);
  }
}

export const RangeNumberDataPointConfigSchema = DataPointConfigSchemaFactory.createForClass(
  strategy,
  RangeNumberDataPointConfig,
);

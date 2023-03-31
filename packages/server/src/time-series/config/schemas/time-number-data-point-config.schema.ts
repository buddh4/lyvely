import { Prop, Schema } from '@nestjs/mongoose';
import { NumberDataPointConfig } from './number-data-point-config.schema';
import { DataPointInputType, INumberDataPointSettings, DataPointValueType } from '@lyvely/common';
import { DataPointConfigSchemaFactory } from '../components/data-point-config-schema.factory';
import { DataPointConfigFactory } from '../components/data-point-config.factory';
import { NestedSchema } from '@/core';

const strategy = DataPointConfigFactory.getStrategyName(
  DataPointValueType.Number,
  DataPointInputType.Time,
);

@NestedSchema()
export class TimeNumberDataPointConfig extends NumberDataPointConfig {
  strategy = strategy;

  @Prop({ enum: [DataPointInputType.Time] })
  inputType: DataPointInputType;

  constructor(settings: INumberDataPointSettings) {
    super(DataPointInputType.Time, settings);
  }
}

export const TimeNumberDataPointConfigSchema = DataPointConfigSchemaFactory.createForClass(
  strategy,
  TimeNumberDataPointConfig,
);

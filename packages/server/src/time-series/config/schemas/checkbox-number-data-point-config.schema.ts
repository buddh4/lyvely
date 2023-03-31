import { Prop, Schema } from '@nestjs/mongoose';
import { NumberDataPointConfig } from './number-data-point-config.schema';
import { DataPointInputType, INumberDataPointSettings, DataPointValueType } from '@lyvely/common';
import { DataPointConfigSchemaFactory } from '../components/data-point-config-schema.factory';
import { DataPointConfigFactory } from '../components/data-point-config.factory';
import { NestedSchema } from '@/core';

const strategy = DataPointConfigFactory.getStrategyName(
  DataPointValueType.Number,
  DataPointInputType.Checkbox,
);

@NestedSchema()
export class CheckboxNumberDataPointConfig extends NumberDataPointConfig {
  strategy = strategy;

  @Prop({ enum: [DataPointInputType.Checkbox] })
  inputType: DataPointInputType;

  constructor(settings: INumberDataPointSettings) {
    super(DataPointInputType.Checkbox, settings);
  }
}

export const CheckboxNumberDataPointConfigSchema = DataPointConfigSchemaFactory.createForClass(
  strategy,
  CheckboxNumberDataPointConfig,
);

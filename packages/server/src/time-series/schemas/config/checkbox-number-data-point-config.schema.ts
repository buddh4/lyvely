import { Prop } from '@nestjs/mongoose';
import { NumberDataPointConfig } from './number-data-point-config.schema';
import { DataPointInputType, INumberDataPointSettings, DataPointValueType } from '@lyvely/common';
import { DataPointConfigFactory, DataPointConfigSchemaFactory } from '../../components';
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

  constructor(settings: Omit<INumberDataPointSettings, 'inputType'>) {
    super(DataPointInputType.Checkbox, settings);
  }
}

export const CheckboxNumberDataPointConfigSchema = DataPointConfigSchemaFactory.createForClass(
  strategy,
  CheckboxNumberDataPointConfig,
);

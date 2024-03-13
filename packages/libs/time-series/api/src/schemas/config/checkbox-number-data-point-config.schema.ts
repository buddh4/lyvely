import { Prop } from '@nestjs/mongoose';
import { NumberDataPointConfig } from './number-data-point-config.schema';
import {
  DataPointInputType,
  INumberDataPointSettings,
  DataPointValueType,
} from '@lyvely/time-series-interface';
import { DataPointConfigFactory } from '../data-point-config.factory';
import { DataPointConfigSchemaFactory } from '../data-point-config-schema.factory';
import { NestedSchema } from '@lyvely/api';

const strategy = DataPointConfigFactory.getStrategyName(
  DataPointValueType.Number,
  DataPointInputType.Checkbox,
);

@NestedSchema()
export class CheckboxNumberDataPointConfig extends NumberDataPointConfig {
  override strategy = strategy;

  @Prop({ enum: [DataPointInputType.Checkbox] })
  override inputType: DataPointInputType;

  @Prop({ required: true })
  override max: number;

  constructor(settings: Omit<INumberDataPointSettings, 'inputType'>) {
    super(DataPointInputType.Checkbox, settings);
  }
}

export const CheckboxNumberDataPointConfigSchema = DataPointConfigSchemaFactory.createForClass(
  strategy,
  CheckboxNumberDataPointConfig,
);

import { Prop } from '@nestjs/mongoose';
import {
  DataPointInputType,
  DataPointValueType,
  ISelectionDataPointSettings,
} from '@lyvely/common';
import { DataPointConfigSchemaFactory, DataPointConfigFactory } from '../components';
import { SelectionDataPointConfig } from './selection-data-point-config.schema';
import { NestedSchema } from '@/core';

const strategy = DataPointConfigFactory.getStrategyName(
  DataPointValueType.Selection,
  DataPointInputType.Radio,
);

@NestedSchema()
export class RadioSelectionDataPointConfig extends SelectionDataPointConfig {
  strategy = strategy;

  @Prop({
    enum: [DataPointInputType.Radio],
    required: true,
    default: DataPointInputType.Radio,
  })
  inputType: DataPointInputType = DataPointInputType.Radio;

  constructor(settings: Omit<ISelectionDataPointSettings, 'inputType'>) {
    super(DataPointInputType.Radio, settings);
  }
}

export const RadioSelectionDataPointConfigSchema = DataPointConfigSchemaFactory.createForClass(
  strategy,
  RadioSelectionDataPointConfig,
);

import { Prop } from '@nestjs/mongoose';
import {
  DataPointInputType,
  DataPointValueType,
  ISelectionDataPointSettings,
} from '@lyvely/time-series-interface';
import { DataPointConfigFactory } from '../data-point-config.factory';
import { DataPointConfigSchemaFactory } from '../data-point-config-schema.factory';
import { SelectionDataPointConfig } from './selection-data-point-config.schema';
import { NestedSchema } from '@lyvely/api';

const strategy = DataPointConfigFactory.getStrategyName(
  DataPointValueType.Selection,
  DataPointInputType.Radio,
);

@NestedSchema()
export class RadioSelectionDataPointConfig extends SelectionDataPointConfig {
  override strategy = strategy;

  @Prop({
    enum: [DataPointInputType.Radio],
    required: true,
    default: DataPointInputType.Radio,
  })
  override inputType: DataPointInputType = DataPointInputType.Radio;

  constructor(settings: Omit<ISelectionDataPointSettings, 'inputType'>) {
    super(DataPointInputType.Radio, settings);
  }
}

export const RadioSelectionDataPointConfigSchema = DataPointConfigSchemaFactory.createForClass(
  strategy,
  RadioSelectionDataPointConfig,
);

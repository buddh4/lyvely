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
  DataPointInputType.Checkbox
);

@NestedSchema()
export class CheckboxSelectionDataPointConfig extends SelectionDataPointConfig {
  override strategy = strategy;

  @Prop({
    enum: [DataPointInputType.Checkbox],
    required: true,
    default: DataPointInputType.Checkbox,
  })
  override inputType: DataPointInputType = DataPointInputType.Checkbox;

  constructor(settings: Omit<ISelectionDataPointSettings, 'inputType'>) {
    super(DataPointInputType.Checkbox, settings);
  }
}

export const CheckboxSelectionDataPointConfigSchema = DataPointConfigSchemaFactory.createForClass(
  strategy,
  CheckboxSelectionDataPointConfig
);

import { Prop } from '@nestjs/mongoose';
import {
  DataPointInputType,
  DataPointValueType,
  ISelectionDataPointSettings,
} from '@lyvely/common';
import { DataPointConfigFactory, DataPointConfigSchemaFactory } from '../../components';
import { SelectionDataPointConfig } from './selection-data-point-config.schema';
import { NestedSchema } from '@/core';

const strategy = DataPointConfigFactory.getStrategyName(
  DataPointValueType.Selection,
  DataPointInputType.Dropdown,
);

@NestedSchema()
export class DropdownSelectionDataPointConfig extends SelectionDataPointConfig {
  strategy = strategy;

  @Prop({
    enum: [DataPointInputType.Dropdown],
    required: true,
    default: DataPointInputType.Dropdown,
  })
  inputType: DataPointInputType = DataPointInputType.Dropdown;

  constructor(settings: Omit<ISelectionDataPointSettings, 'inputType'>) {
    super(DataPointInputType.Dropdown, settings);
    this.allowOther = false;
  }
}

export const DropdownSelectionDataPointConfigSchema = DataPointConfigSchemaFactory.createForClass(
  strategy,
  DropdownSelectionDataPointConfig,
);

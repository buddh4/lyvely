import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  DataPointInputType,
  DataPointValueType,
  getStringEnumValues,
  ISelectionDataPointConfig,
  ISelectionDataPointConfigRevision,
  ISelectionDataPointSettings,
  PropertyType,
  DataPointSelectionInputType,
} from '@lyvely/common';
import { DataPointConfig, DataPointConfigRevision } from './data-point-config.schema';
import { NestedSchema } from '@/core';
import { pick } from 'lodash';

@NestedSchema()
export class SelectionDataPointConfigRevision
  extends DataPointConfigRevision
  implements ISelectionDataPointConfigRevision
{
  @Prop({ type: [String], required: true })
  options: Array<string>;

  @Prop({ default: false })
  allowOther: boolean;

  constructor(config: ISelectionDataPointConfig) {
    super(config);
    this.valueType = DataPointValueType.Selection;
    this.allowOther ??= false;
  }
}

export const SelectionDataPointConfigRevisionSchema = SchemaFactory.createForClass(
  SelectionDataPointConfigRevision,
);

@Schema({ _id: false, discriminatorKey: 'strategy' })
export class SelectionDataPointConfig
  extends DataPointConfig<ISelectionDataPointSettings>
  implements ISelectionDataPointConfig
{
  @Prop({
    type: String,
    enum: [DataPointValueType.Selection],
    required: true,
    default: DataPointValueType.Selection,
  })
  @PropertyType(String, { default: DataPointValueType.Selection })
  valueType: typeof DataPointValueType.Selection = DataPointValueType.Selection;

  @Prop({ enum: getStringEnumValues(DataPointSelectionInputType) })
  inputType: DataPointInputType;

  @Prop({ type: [SelectionDataPointConfigRevisionSchema], default: [] })
  history: SelectionDataPointConfigRevision[];

  @Prop({ type: [String], required: true })
  options: Array<string>;

  @Prop({ default: false })
  allowOther: boolean;

  constructor(inputType?: DataPointInputType, settings?: ISelectionDataPointSettings) {
    super(DataPointValueType.Text, inputType, settings);
  }

  getSettings(): ISelectionDataPointSettings {
    return pick(this, ['options', 'allowOther', 'interval', 'userStrategy']);
  }

  setSettings(settings: ISelectionDataPointSettings) {
    Object.assign(this, pick(settings, ['interval', 'userStrategy', 'options', 'allowOther']));
  }
}

export const SelectionDataPointConfigSchema =
  SchemaFactory.createForClass(SelectionDataPointConfig);

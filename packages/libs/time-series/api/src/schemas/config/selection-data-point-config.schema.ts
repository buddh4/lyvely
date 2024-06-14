import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  DataPointInputType,
  DataPointValueType,
  ISelectionDataPointConfig,
  ISelectionDataPointConfigRevision,
  ISelectionDataPointSettings,
  DataPointSelectionInputType,
} from '@lyvely/time-series-interface';
import { getStringEnumValues, PropertyType, pick } from '@lyvely/common';
import { DataPointConfig, DataPointConfigRevision } from './data-point-config.schema';
import { NestedSchema } from '@lyvely/api';

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
    this.options ??= config.options;
  }
}

export const SelectionDataPointConfigRevisionSchema = SchemaFactory.createForClass(
  SelectionDataPointConfigRevision
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
  override valueType: typeof DataPointValueType.Selection = DataPointValueType.Selection;

  @Prop({ enum: getStringEnumValues(DataPointSelectionInputType) })
  override inputType: DataPointInputType;

  @Prop({ type: [SelectionDataPointConfigRevisionSchema], default: [] })
  override history: SelectionDataPointConfigRevision[];

  @Prop({ type: [String], required: true })
  options: Array<string>;

  @Prop({ default: false })
  allowOther: boolean;

  constructor(inputType?: DataPointInputType, settings?: ISelectionDataPointSettings) {
    super(DataPointValueType.Text, inputType!, settings);
  }

  getSettings(): ISelectionDataPointSettings {
    return pick(this, 'options', 'allowOther', 'interval', 'userStrategy');
  }

  setSettings(settings: ISelectionDataPointSettings) {
    Object.assign(this, pick(settings, 'interval', 'userStrategy', 'options', 'allowOther'));
  }
}

export const SelectionDataPointConfigSchema =
  SchemaFactory.createForClass(SelectionDataPointConfig);

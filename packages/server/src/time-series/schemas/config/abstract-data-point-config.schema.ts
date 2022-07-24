import { Prop } from '@nestjs/mongoose';
import { getStringEnumValues, IDataPointConfig, DataPointInputType, DataPointValueType } from 'lyvely-common';

export abstract class AbstractDataPointConfigSchema<S = any> implements IDataPointConfig {

  @Prop({ enum: getStringEnumValues(DataPointValueType), required: true, default: DataPointValueType.Number })
  valueType: DataPointValueType;

  @Prop({ enum: getStringEnumValues(DataPointInputType) })
  inputType?: DataPointInputType;

  strategy: string;

  /**
   * Can be used to set additional config settings. If no settings are given, default values should be set.
   * The type of setting may differ between config types.
   * @param settings
   */
  abstract setSettings(settings?: S);

  /**
   * Can be used to get the settings of a config instance. In case the instance does not support additional settings this
   * function should return undefined.
   */
  abstract getSettings(): S|undefined;

  constructor(DataPointValueType: DataPointValueType, inputType: DataPointInputType, settings?: S) {
    this.valueType = DataPointValueType;
    this.inputType = inputType;
    this.setSettings(settings);
  }
}

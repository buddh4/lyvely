import { Prop } from '@nestjs/mongoose';
import {
  getStringEnumValues,
  IDataPointConfig,
  DataPointInputType,
  DataPointValueType,
  IDataPointConfigRevision,
  getNumberEnumValues, CalendarIntervalEnum } from '@lyvely/common';
import { isEqual } from "lodash";

export interface DataPointSettings {
  interval: CalendarIntervalEnum;
}

export abstract class DataPointConfig<TSettings extends DataPointSettings = DataPointSettings, TRevision extends DataPointConfigRevision = DataPointConfigRevision> implements IDataPointConfig {

  @Prop({ enum: getStringEnumValues(DataPointValueType), required: true, default: DataPointValueType.Number })
  valueType: DataPointValueType;

  @Prop({ enum: getStringEnumValues(DataPointInputType), required: true })
  inputType?: DataPointInputType;

  @Prop({ enum: getNumberEnumValues(CalendarIntervalEnum), required: true })
  interval: CalendarIntervalEnum;

  strategy: string;

  history: TRevision[];



  /**
   * Can be used to set additional config settings. If no settings are given, default values should be set.
   * The type of setting may differ between config types.
   * @param settings
   */
  abstract setSettings(settings?: TSettings);

  /**
   * Can be used to get the settings of a config instance. In case the instance does not support additional settings this
   * function should return undefined.
   */
  abstract getSettings(): TSettings|undefined;

  isEqualTo(cfg: DataPointConfig) {
    return isEqual(cfg.getSettings(), this.getSettings());
  }

  constructor(DataPointValueType: DataPointValueType, inputType: DataPointInputType, settings?: TSettings) {
    this.valueType = DataPointValueType;
    this.inputType = inputType;
    this.interval = settings?.interval;
    this.history = [];
    this.setSettings(settings);
  }
}

export abstract class DataPointConfigRevision implements IDataPointConfigRevision {
  @Prop( { type: Date, required: true, immutable: true })
  validUntil: Date;

  @Prop({ enum: getStringEnumValues(DataPointValueType), required: true, default: DataPointValueType.Number })
  valueType: DataPointValueType;

  @Prop({ enum: getStringEnumValues(DataPointInputType), required: true })
  inputType?: DataPointInputType;

  @Prop( { type: String, required: true })
  strategy: string;

  @Prop({ enum: getNumberEnumValues(CalendarIntervalEnum), required: true })
  interval: CalendarIntervalEnum;

  constructor(config: IDataPointConfig) {
    this.validUntil = new Date();
    this.valueType = config.valueType;
    this.inputType = config.inputType;
    this.strategy = config.strategy;
    this.interval = config.interval;
  }
}

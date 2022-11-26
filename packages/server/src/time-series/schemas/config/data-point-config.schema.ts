import { Prop } from '@nestjs/mongoose';
import {
  getStringEnumValues,
  IDataPointConfig,
  DataPointInputType,
  DataPointValueType,
  IDataPointConfigRevision,
  getNumberEnumValues,
  CalendarIntervalEnum,
  UserAssignmentStrategy,
} from '@lyvely/common';
import { isEqual } from 'lodash';

export interface IDataPointSettings {
  interval: CalendarIntervalEnum;
}

export abstract class DataPointConfig<
  TSettings extends IDataPointSettings = IDataPointSettings,
  TRevision extends DataPointConfigRevision = DataPointConfigRevision,
> implements IDataPointConfig
{
  @Prop({ enum: getStringEnumValues(DataPointValueType), required: true, default: DataPointValueType.Number })
  valueType: DataPointValueType;

  @Prop({ enum: getStringEnumValues(DataPointInputType), required: true })
  inputType: DataPointInputType;

  @Prop({ enum: getNumberEnumValues(CalendarIntervalEnum), required: true })
  interval: CalendarIntervalEnum;

  @Prop({ enum: getNumberEnumValues(UserAssignmentStrategy), default: UserAssignmentStrategy.Shared, required: true })
  userStrategy: UserAssignmentStrategy;

  strategy: string;

  history: TRevision[];

  pushRevision(rev: TRevision) {
    if (!this.history) {
      this.history = [];
    }

    this.history.push(rev);
  }

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
  abstract getSettings(): TSettings | undefined;

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
  @Prop({ type: Date, required: true, immutable: true })
  validUntil: Date;

  @Prop({ enum: getStringEnumValues(DataPointValueType), required: true, default: DataPointValueType.Number })
  valueType: DataPointValueType;

  @Prop({ enum: getStringEnumValues(DataPointInputType), required: true })
  inputType?: DataPointInputType;

  @Prop({ enum: getNumberEnumValues(CalendarIntervalEnum), required: true })
  interval: CalendarIntervalEnum;

  constructor(config: IDataPointConfig) {
    this.validUntil = new Date();
    this.valueType = config.valueType;
    this.inputType = config.inputType;
    this.interval = config.interval;
  }
}

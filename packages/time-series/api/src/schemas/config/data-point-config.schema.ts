import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  IDataPointConfig,
  DataPointInputType,
  DataPointValueType,
  IDataPointConfigRevision,
} from '@lyvely/time-series-interface';
import { getStringEnumValues, getNumberEnumValues, UserAssignmentStrategy } from '@lyvely/common';
import { CalendarInterval } from '@lyvely/dates';
import { isEqual } from 'lodash';

export interface IDataPointSettings {
  interval: CalendarInterval;
}

export abstract class DataPointConfig<
  TSettings extends IDataPointSettings = IDataPointSettings,
  TRevision extends DataPointConfigRevision = DataPointConfigRevision,
> implements IDataPointConfig
{
  @Prop({
    enum: getStringEnumValues(DataPointValueType),
    required: true,
    default: DataPointValueType.Number,
  })
  valueType: string;

  @Prop({ enum: getStringEnumValues(DataPointInputType), required: true })
  inputType: DataPointInputType;

  @Prop({ enum: getNumberEnumValues(CalendarInterval), required: true })
  interval: CalendarInterval;

  @Prop({
    enum: getNumberEnumValues(UserAssignmentStrategy),
    default: UserAssignmentStrategy.Shared,
    required: true,
  })
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

  constructor(DataPointValueType: string, inputType: DataPointInputType, settings?: TSettings) {
    this.valueType = DataPointValueType;
    this.inputType = inputType;
    this.interval = settings?.interval || this.interval;
    this.history = [];
    if (settings) {
      this.setSettings(settings);
    }
  }
}

export abstract class DataPointConfigRevision implements IDataPointConfigRevision {
  @Prop({ type: Date, required: true, immutable: true })
  validUntil: Date;

  @Prop({
    enum: getStringEnumValues(DataPointValueType),
    required: true,
    default: DataPointValueType.Number,
  })
  valueType: string;

  @Prop({ enum: getStringEnumValues(DataPointInputType), required: true })
  inputType?: DataPointInputType;

  @Prop({ enum: getNumberEnumValues(CalendarInterval), required: true })
  interval: CalendarInterval;

  constructor(config: IDataPointConfig) {
    this.validUntil = new Date();
    this.valueType = config.valueType;
    this.inputType = config.inputType;
    this.interval = config.interval;
  }
}
/**
 * This data-point config schema describes a data point config without additional values and is mainly used as default
 * schema. In most cases a TimeSeriesContent type will define an own config schema or use one of the existing schemas
 * e.g. NumberDataPointSchema
 */
@Schema({ _id: false, timestamps: true, discriminatorKey: 'strategy' })
export class DefaultDataPointConfig extends DataPointConfig {
  setSettings(settings: any) {
    Object.assign(this, settings);
  }

  getSettings(): any {
    return {};
  }
}

export const DataPointConfigSchema = SchemaFactory.createForClass(DefaultDataPointConfig);

@Schema({ _id: false, timestamps: true, strict: false })
export class DefaultDataPointConfigRevision extends DataPointConfigRevision {}

export const DefaultDataPointConfigRevisionSchema = SchemaFactory.createForClass(
  DefaultDataPointConfigRevision,
);

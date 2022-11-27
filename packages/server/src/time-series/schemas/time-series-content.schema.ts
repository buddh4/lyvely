import { DataPointInputType, DataPointValueType, isSameDay, ITimeSeriesContentConfig } from '@lyvely/common';
import { Content, IContentEntity } from '@/content';
import { DataPointConfig, DataPointConfigFactory, DefaultDataPointConfig } from './config';
import { EntityType } from '@/core';
import { cloneDeep } from 'lodash';

type TimeSeriesContentEntity = IContentEntity & EntityType<TimeSeriesContent>;
type Unpacked<T> = T extends (infer U)[] ? U : T;
/**
 * This class serves as base class for all time series content types and schemas. A subclass usually overwrites the
 * `config` schema type either with a custom or a predefined one as NumberDataPointConfig as well as overwriting
 * `dataPointConfigHistory` schema.
 */
export abstract class TimeSeriesContent<
  TContent extends TimeSeriesContentEntity = TimeSeriesContentEntity,
  TDataPointConfig extends DefaultDataPointConfig = DefaultDataPointConfig,
> extends Content<TContent> {
  config: ITimeSeriesContentConfig<TDataPointConfig>;

  abstract createTimeSeriesConfigRevision(
    rev: TDataPointConfig,
  ): Unpacked<TDataPointConfig['history']> | null | undefined;

  applyTimeSeriesConfigUpdate(update: Partial<TDataPointConfig>) {
    const oldConfig = this.timeSeriesConfig;
    const updatedConfig = Object.assign(cloneDeep(oldConfig), update);

    if (
      (updatedConfig.inputType && updatedConfig.inputType !== oldConfig.inputType) ||
      (updatedConfig.valueType && updatedConfig.valueType !== oldConfig.valueType)
    ) {
      updatedConfig.strategy = DataPointConfigFactory.getStrategyName(updatedConfig.valueType, updatedConfig.inputType);
    }

    if (this.timeSeriesConfigRevisionCheck(updatedConfig)) {
      this.timeSeriesConfig = updatedConfig;
      this.pushTimeSeriesConfigRevision(oldConfig);
    } else {
      this.timeSeriesConfig = updatedConfig;
    }
  }

  private pushTimeSeriesConfigRevision(cfg: TDataPointConfig) {
    if (!this.timeSeriesConfig.history) {
      this.timeSeriesConfig.history = [];
    }

    const revision = this.createTimeSeriesConfigRevision(cfg);

    if (revision) {
      this.timeSeriesConfig.history.push(revision);
    }
  }

  private timeSeriesConfigRevisionCheck(update: TDataPointConfig) {
    return !this.timeSeriesConfig.isEqualTo(update) && !this.getTimeSeriesRevisionUpdatedAt(new Date());
  }

  getTimeSeriesRevisionUpdatedAt(date: Date) {
    if (!this.timeSeriesConfig?.history.length) {
      return false;
    }

    return this.timeSeriesConfig.history.find((rev) => isSameDay(rev.validUntil, date));
  }

  get timeSeriesConfig() {
    return this.config?.timeSeries;
  }

  set timeSeriesConfig(config: TDataPointConfig) {
    if (!this.config) {
      this.config = <any>{};
    }
    this.config.timeSeries = config;
  }

  afterInit() {
    // in case plain object is given we create a class instance
    if (!(this.timeSeriesConfig instanceof DataPointConfig)) {
      this.timeSeriesConfig = DataPointConfigFactory.createInstance(this.timeSeriesConfig);
    }

    super.afterInit();
  }
}

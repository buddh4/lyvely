import {
  DataPointConfig,
  DataPointConfigFactory,
  DataPointConfigRevision,
  TimeSeriesContent,
} from '@/time-series';
import { cloneDeep } from 'lodash';
import { isSameDay } from '@lyvely/common';
import { useDataPointConfigStrategyRegistry } from '@/time-series/config/components/time-series-config-strategy.registry';

export class DataPointConfigHandler {
  static applyUpdate(model: TimeSeriesContent, update: Partial<DataPointConfigRevision>) {
    const oldConfig = model.timeSeriesConfig;
    const updatedConfig = DataPointConfigHandler.prepareUpdate(model, update);

    if (
      (updatedConfig.inputType && updatedConfig.inputType !== oldConfig.inputType) ||
      (updatedConfig.valueType && updatedConfig.valueType !== oldConfig.valueType)
    ) {
      updatedConfig.strategy = DataPointConfigFactory.getStrategyName(
        updatedConfig.valueType,
        updatedConfig.inputType,
      );
    }

    if (DataPointConfigHandler.timeSeriesConfigRevisionCheck(model, updatedConfig)) {
      model.timeSeriesConfig = updatedConfig;
      DataPointConfigHandler.pushTimeSeriesConfigRevision(model, oldConfig);
    } else {
      model.timeSeriesConfig = updatedConfig;
    }
  }

  static prepareConfig(model: TimeSeriesContent, config?: DataPointConfig) {
    if (!config) {
      config = model.timeSeriesConfig;
    }

    useDataPointConfigStrategyRegistry()
      .getStrategy(model.timeSeriesConfig.valueType)
      .prepareConfig(config);
  }

  private static prepareUpdate(model: TimeSeriesContent, update: Partial<DataPointConfigRevision>) {
    const preparedUpdate = useDataPointConfigStrategyRegistry()
      .getStrategy(model.timeSeriesConfig.valueType)
      .prepareUpdate(update);
    const updatedConfig = Object.assign(cloneDeep(model.timeSeriesConfig), preparedUpdate);
    DataPointConfigHandler.prepareConfig(model, updatedConfig);
    return updatedConfig;
  }

  private static timeSeriesConfigRevisionCheck(model: TimeSeriesContent, update: DataPointConfig) {
    return (
      !model.timeSeriesConfig.isEqualTo(update) &&
      !DataPointConfigHandler.getTimeSeriesRevisionUpdatedAt(model)
    );
  }

  private static getTimeSeriesRevisionUpdatedAt(model: TimeSeriesContent, date: Date = new Date()) {
    if (!model.timeSeriesConfig?.history.length) return false;

    return model.timeSeriesConfig.history.find((rev) => isSameDay(rev.validUntil, date));
  }

  private static pushTimeSeriesConfigRevision(model: TimeSeriesContent, cfg: DataPointConfig) {
    if (!model.timeSeriesConfig.history) {
      model.timeSeriesConfig.history = [];
    }

    const revision = DataPointConfigHandler.createTimeSeriesConfigRevision(model, cfg);

    if (revision) {
      model.timeSeriesConfig.history.push(revision);
    }
  }

  private static createTimeSeriesConfigRevision(model: TimeSeriesContent, old: DataPointConfig) {
    return useDataPointConfigStrategyRegistry()
      .getStrategy(model.timeSeriesConfig.valueType)
      .createRevision(old);
  }
}

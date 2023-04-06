import { DataPointConfigFactory } from './data-point-config.factory';
import { cloneDeep, pick } from 'lodash';
import { isSameDay, useDataPointStrategyFacade } from '@lyvely/common';
import { TimeSeriesContent } from './time-series-content.schema';
import { DataPointConfig, DataPointConfigRevision } from './config';

const dataPointFacade = useDataPointStrategyFacade();

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

  private static prepareUpdate(model: TimeSeriesContent, update: Partial<DataPointConfigRevision>) {
    const settingKeys = dataPointFacade.getSettingKeys(model.timeSeriesConfig.valueType);
    const preparedUpdate = pick(update, ['inputType', 'userStrategy', 'interval', ...settingKeys]);
    const updatedConfig = Object.assign(cloneDeep(model.timeSeriesConfig), preparedUpdate);
    DataPointConfigHandler.prepareConfig(model, updatedConfig);
    return updatedConfig;
  }

  static prepareConfig(model: TimeSeriesContent, config?: DataPointConfig) {
    if (!config) {
      config = model.timeSeriesConfig;
    }

    dataPointFacade.getService(model.timeSeriesConfig.valueType).prepareConfig(config);
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
    return dataPointFacade.createRevision(old);
  }
}

import { DataPointConfigFactory } from './data-point-config.factory';
import { cloneDeep, pick } from 'lodash';
import { isSameDay, useDataPointStrategyFacade, useSingleton } from '@lyvely/common';
import { TimeSeriesContent } from './time-series-content.schema';
import { DataPointConfig, DataPointConfigRevision } from './config';

const dataPointFacade = useDataPointStrategyFacade();

export class DataPointConfigHandler {
  applyUpdate(model: TimeSeriesContent<any>, update: Partial<DataPointConfigRevision>) {
    const oldConfig = model.timeSeriesConfig;
    const updatedConfig = this.prepareUpdate(model, update);

    if (
      (updatedConfig.inputType && updatedConfig.inputType !== oldConfig.inputType) ||
      (updatedConfig.valueType && updatedConfig.valueType !== oldConfig.valueType)
    ) {
      updatedConfig.strategy = DataPointConfigFactory.getStrategyName(
        updatedConfig.valueType,
        updatedConfig.inputType,
      );
    }

    if (this.timeSeriesConfigRevisionCheck(model, updatedConfig)) {
      model.timeSeriesConfig = updatedConfig;
      this.pushTimeSeriesConfigRevision(model, oldConfig);
    } else {
      model.timeSeriesConfig = updatedConfig;
    }
  }

  private prepareUpdate(model: TimeSeriesContent<any>, update: Partial<DataPointConfigRevision>) {
    const settingKeys = dataPointFacade.getSettingKeys(model.timeSeriesConfig.valueType);
    const preparedUpdate = pick(update, ['inputType', 'userStrategy', 'interval', ...settingKeys]);
    const updatedConfig = Object.assign(cloneDeep(model.timeSeriesConfig), preparedUpdate);
    this.prepareConfig(model, updatedConfig);
    return updatedConfig;
  }

  prepareConfig(model: TimeSeriesContent<any>, config?: DataPointConfig) {
    if (!config) {
      config = model.timeSeriesConfig;
    }

    dataPointFacade.getService(model.timeSeriesConfig.valueType).prepareConfig(config);
  }

  private timeSeriesConfigRevisionCheck(model: TimeSeriesContent<any>, update: DataPointConfig) {
    return !model.timeSeriesConfig.isEqualTo(update) && !this.getTimeSeriesRevisionUpdatedAt(model);
  }

  private getTimeSeriesRevisionUpdatedAt(model: TimeSeriesContent<any>, date: Date = new Date()) {
    if (!model.timeSeriesConfig?.history.length) return false;

    return model.timeSeriesConfig.history.find((rev) => isSameDay(rev.validUntil, date));
  }

  private pushTimeSeriesConfigRevision(model: TimeSeriesContent<any>, cfg: DataPointConfig) {
    if (!model.timeSeriesConfig.history) {
      model.timeSeriesConfig.history = [];
    }

    const revision = this.createTimeSeriesConfigRevision(model, cfg);

    if (revision) {
      model.timeSeriesConfig.history.push(revision);
    }
  }

  private createTimeSeriesConfigRevision(model: TimeSeriesContent<any>, old: DataPointConfig) {
    return dataPointFacade.createRevision(old);
  }
}

export const useDataPointConfigHandler = useSingleton(() => new DataPointConfigHandler());

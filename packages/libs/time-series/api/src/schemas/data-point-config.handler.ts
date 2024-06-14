import { DataPointConfigFactory } from './data-point-config.factory';
import { cloneDeep, pick, useSingleton } from '@lyvely/common';
import { IntegrityException } from '@lyvely/api';
import { useDataPointStrategyFacade } from '@lyvely/time-series-interface';
import { isSameDay } from '@lyvely/dates';
import { TimeSeriesContent } from './time-series-content.schema';
import { DataPointConfig, DataPointConfigRevision } from './config';

const dataPointFacade = useDataPointStrategyFacade();

export class DataPointConfigHandler {
  applyUpdate(model: TimeSeriesContent, update: Partial<DataPointConfigRevision>) {
    const oldConfig = model.timeSeriesConfig;
    const updatedConfig = this.prepareUpdate(model, update);

    if (
      (updatedConfig.inputType && updatedConfig.inputType !== oldConfig.inputType) ||
      (updatedConfig.valueType && updatedConfig.valueType !== oldConfig.valueType)
    ) {
      updatedConfig.strategy = DataPointConfigFactory.getStrategyName(
        updatedConfig.valueType,
        updatedConfig.inputType
      );
    }

    if (!DataPointConfigFactory.validateStrategyByName(updatedConfig.strategy)) {
      throw new IntegrityException(
        `Could not apply update due to use of invalid data point strategy ${updatedConfig.strategy}`
      );
    }

    if (this.timeSeriesConfigRevisionCheck(model, updatedConfig)) {
      model.timeSeriesConfig = updatedConfig;
      this.pushTimeSeriesConfigRevision(model, oldConfig);
    } else {
      model.timeSeriesConfig = updatedConfig;
    }
  }

  private prepareUpdate(model: TimeSeriesContent, update: Partial<DataPointConfigRevision>) {
    const valueType = update.valueType || model.timeSeriesConfig.valueType;
    const inputType = update.inputType || model.timeSeriesConfig.inputType;
    const preparedUpdate = this.pickValueTypeSettings(update, valueType);

    // In case the value type changed we create a new config instance otherwise we just overwrite the changes
    const updatedConfig: DataPointConfig =
      valueType !== model.timeSeriesConfig.valueType
        ? DataPointConfigFactory.initializeConfig(valueType, inputType, {
            ...this.pickValueTypeSettings(model.timeSeriesConfig, valueType),
            ...preparedUpdate,
          })
        : DataPointConfigFactory.instantiateConfig({
            ...cloneDeep(model.timeSeriesConfig),
            ...preparedUpdate,
          });

    this.prepareConfig(model, updatedConfig);
    return updatedConfig;
  }

  private pickValueTypeSettings(obj: any, valueType: string) {
    const settingKeys = dataPointFacade.getSettingKeys(valueType);
    return pick(obj, 'inputType', 'valueType', 'userStrategy', 'interval', ...settingKeys);
  }

  prepareConfig(model: TimeSeriesContent, config?: DataPointConfig) {
    if (!config) {
      config = model.timeSeriesConfig;
    }

    dataPointFacade.getService(model.timeSeriesConfig.valueType).prepareConfig(config);
  }

  private timeSeriesConfigRevisionCheck(model: TimeSeriesContent, update: DataPointConfig) {
    return !model.timeSeriesConfig.isEqualTo(update) && !this.getTimeSeriesRevisionUpdatedAt(model);
  }

  private getTimeSeriesRevisionUpdatedAt(model: TimeSeriesContent, date: Date = new Date()) {
    if (!model.timeSeriesConfig?.history.length) return false;

    return model.timeSeriesConfig.history.find((rev) => isSameDay(rev.validUntil, date));
  }

  private pushTimeSeriesConfigRevision(model: TimeSeriesContent, cfg: DataPointConfig) {
    if (!model.timeSeriesConfig.history) {
      model.timeSeriesConfig.history = [];
    }

    const revision = this.createTimeSeriesConfigRevision(model, cfg);

    if (revision) {
      model.timeSeriesConfig.history.push(revision);
    }
  }

  private createTimeSeriesConfigRevision(model: TimeSeriesContent, old: DataPointConfig) {
    return dataPointFacade.createRevision(old);
  }
}

export const useDataPointConfigHandler = useSingleton(() => new DataPointConfigHandler());

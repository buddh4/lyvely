import { CalendarIntervalEnum } from '@/calendar';
import { Filter } from '@/models';
import { DataPointModel } from './data-point.model';
import { TimeSeriesContentModel } from './time-series-content.model';

type TimeSeriesContentIdentity = TimeSeriesContentModel | string;

/**
 * This class is used to stores time series content and related data points.
 */
export abstract class TimeSeriesDataPointStore<
  Model extends TimeSeriesContentModel,
  TDataPointModel extends DataPointModel,
> {
  models: Map<string, Model> = new Map();
  logs: Map<string, Map<string, TDataPointModel>> = new Map();

  abstract sort(models: Model[]);
  abstract createDataPoint(model: Model, timingId: string): TDataPointModel;

  protected getId(model: TimeSeriesContentIdentity) {
    if (typeof model === 'string') {
      return model;
    }

    return model.id.toString();
  }

  setModel(model: Model) {
    this.models.set(this.getId(model), model);
  }

  setDataPoint(log: TDataPointModel) {
    const modelId = log.cid;

    if (!modelId) {
      console.error('tried to add log without content id', log);
      return;
    }

    if (!this.logs.has(modelId)) {
      this.logs.set(modelId, new Map());
    }

    this.logs.get(modelId).set(log.tid, log);
  }

  setDataPoints(logs: TDataPointModel[]) {
    logs.forEach((log) => this.setDataPoint(log));
  }

  hasModel(model: TimeSeriesContentIdentity) {
    return this.models.has(this.getId(model));
  }

  hasDataPoint(identity: TimeSeriesContentIdentity, timingId: string) {
    const modelId = this.getId(identity);
    if (!this.logs.has(modelId)) {
      return false;
    }

    return this.logs.get(modelId).has(timingId);
  }

  filterModels(filter: (entry: Model, index: number, arr: Model[]) => boolean): Model[] {
    return this.sort(Array.from(this.models.values()).filter(filter));
  }

  getModel(model: TimeSeriesContentIdentity): Model {
    if (!this.hasModel(model)) {
      return null;
    }

    return this.models.get(this.getId(model));
  }

  getModelsByIntervalFilter(interval: CalendarIntervalEnum, filter?: Filter<Model, any>) {
    return this.filterModels((entry) => {
      return entry.dataPointConfig.interval === interval && (!filter || filter.check(entry));
    });
  }

  getDataPoint(identity: TimeSeriesContentIdentity, timingId: string, create = false): TDataPointModel {
    const modelId = this.getId(identity);
    if (!this.hasDataPoint(modelId, timingId)) {
      if (!create) {
        return;
      }

      const model = this.getModel(modelId);
      if (!model) {
        return;
      }

      // Add and fetch log in order to return a reactive instance
      this.setDataPoint(this.createDataPoint(model, timingId));
      return this.getDataPoint(model, timingId);
    }

    return this.logs.get(modelId).get(timingId);
  }
}

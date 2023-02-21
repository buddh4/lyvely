import { CalendarIntervalEnum } from '@/calendar';
import { Filter, sortBySortOrder } from '@/models';
import { DataPointModel } from './data-point.model';
import { TimeSeriesContentModel } from './time-series-content.model';

type TimeSeriesContentIdentity = TimeSeriesContentModel | string;

/**
 * This class is used to stores time series content and related data points.
 */
export abstract class TimeSeriesDataPointStore<
  Model extends TimeSeriesContentModel,
  TDataPointModel extends DataPointModel = DataPointModel,
> {
  models: Map<string, Model> = new Map();
  logs: Map<string, Map<string, TDataPointModel>> = new Map();

  abstract createDataPoint(model: Model, timingId: string): TDataPointModel;

  reset() {
    this.models = new Map();
    this.logs = new Map();
  }

  sort(models: Model[]): Model[] {
    return models.sort(sortBySortOrder);
  }

  protected getId(model: TimeSeriesContentIdentity) {
    if (typeof model === 'string') {
      return model;
    }

    return model.id.toString();
  }

  setModel(model: Model) {
    this.models.set(this.getId(model), model);
  }

  setModels(models: Model[]) {
    const newModel = new Map(models.map((model) => [this.getId(model), model]));
    this.models = new Map([...this.models, ...newModel]);
  }

  setDataPoint(log: TDataPointModel) {
    this._setDataPoint(log, this.logs);
  }

  setDataPoints(logs: TDataPointModel[]) {
    const update = new Map([...this.logs]);

    logs.forEach((log) => {
      this._setDataPoint(log, update);
    });

    this.logs = update;
  }

  private _setDataPoint(log: TDataPointModel, logs: Map<string, Map<string, TDataPointModel>>) {
    const modelId = log.cid;

    if (!modelId) return;

    if (!logs.has(modelId)) {
      logs.set(modelId, new Map());
    }

    logs.get(modelId).set(log.tid, log);
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

  getModelsByIntervalFilter(
    interval: CalendarIntervalEnum,
    filter?: Filter<Model, any>,
    tid?: string,
  ) {
    return this.filterModels((entry) => {
      return entry.timeSeriesConfig.interval === interval && (!filter || filter.check(entry));
    });
  }

  getDataPoint(
    identity: TimeSeriesContentIdentity,
    timingId: string,
    create = false,
  ): TDataPointModel {
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

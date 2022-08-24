import { ITimeSeriesContent, ITimeSeriesDataPoint } from '../interfaces';

type TimeSeriesContentIdentity = ITimeSeriesContent | string;

/**
 * This class is used to stores time series content and related data points.
 */
export abstract class TimeSeriesDataPointStore<Model extends ITimeSeriesContent, DataPointModel extends ITimeSeriesDataPoint> {
  models: Map<string, Model> = new Map();
  logs: Map<string, Map<string, DataPointModel>> = new Map();

  abstract sort(models: Model[]);
  abstract createDataPoint(model: Model, timingId: string): DataPointModel;

  protected getId(model: TimeSeriesContentIdentity) {
    if(typeof model === "string") {
      return model;
    }

    return model.id.toString();
  }

  addModel(model: Model) {
    this.models.set(this.getId(model), model);
  }

  addDataPoint(log: DataPointModel) {
    const modelId = log.cid;

    if(!modelId) {
      console.error('tried to add log without content id', log);
      return;
    }

    if (!this.logs.has(modelId)) {
      this.logs.set(modelId, new Map());
    }

    this.logs.get(modelId).set(log.tid, log);
  }

  addDataPoints(logs: DataPointModel[]) {
    logs.forEach((log) => this.addDataPoint(log));
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

  getDataPoint(identity: TimeSeriesContentIdentity, timingId: string, create = false): DataPointModel {
    const modelId = this.getId(identity);
    if (!this.hasDataPoint(modelId, timingId)) {
      if(!create) {
        return;
      }

      const model = this.getModel(modelId);
      if(!model) {
        return;
      }

      // Add and fetch log in order to return a reactive instance
      this.addDataPoint(this.createDataPoint(model, timingId));
      return this.getDataPoint(model, timingId);
    }

    return this.logs.get(modelId).get(timingId);
  }
}

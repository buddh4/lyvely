import { ITimeSeriesContent, ITimeSeriesDataPoint} from '../interfaces';

type TimeableModelIdentity = ITimeSeriesContent | string;

export abstract class TimeSeriesDataPointStore<Model extends ITimeSeriesContent, LogModel extends ITimeSeriesDataPoint> {
  models: Map<string, Model> = new Map();
  logs: Map<string, Map<string, LogModel>> = new Map();

  abstract sort(models: Model[]);
  abstract createLog(model: Model, timingId: string): LogModel;

  protected getId(model: TimeableModelIdentity) {
    if(typeof model === "string") {
      return model;
    }

    return model.id.toString();
  }

  addModel(model: Model) {
    this.models.set(this.getId(model), model);
  }

  addLog(log: LogModel) {
    let modelId = log.contentId;

    if(!modelId) {
      console.error('tried to add log without content id', log);
      return;
    }

    if (!this.logs.has(modelId)) {
      this.logs.set(modelId, new Map());
    }

    this.logs.get(modelId).set(log.timingId, log);
  }

  addLogs(logs: LogModel[]) {
    logs.forEach((log) => this.addLog(log));
  }

  hasModel(model: TimeableModelIdentity) {
    return this.models.has(this.getId(model));
  }

  hasLog(identity: TimeableModelIdentity, timingId: string) {
    let modelId = this.getId(identity);
    if (!this.logs.has(modelId)) {
      return false;
    }

    return this.logs.get(modelId).has(timingId);
  }

  filterModels(filter): Model[] {
    return this.sort(Array.from(this.models.values()).filter(filter));
  }

  getModel(model: TimeableModelIdentity): Model {
    if (!this.hasModel(model)) {
      return null;
    }

    return this.models.get(this.getId(model));
  }

  getLog(identity: TimeableModelIdentity, timingId: string, create: boolean = false): LogModel {
    let modelId = this.getId(identity);
    if (!this.hasLog(modelId, timingId)) {
      if(!create) {
        return;
      }

      let model = this.getModel(modelId);
      if(!model) {
        return;
      }

      // Add and fetch log in order to return a reactive instance
      this.addLog(this.createLog(model, timingId));
      return this.getLog(model, timingId);
    }

    return this.logs.get(modelId).get(timingId);
  }
}
import { CalendarIntervalEnum } from '@/calendar';
import { sortBySortOrder } from '@/models';
import { DataPointModel } from '../data-points/models/data-point.model';
import { TimeSeriesContentModel } from './time-series-content.model';
import { ContentFilter } from '@/content';
import { useDataPointStrategyFacade } from '@/time-series';

type TimeSeriesContentIdentity = TimeSeriesContentModel | string;

/**
 * This class is used to stores time series content and related data points.
 */
export class TimeSeriesDataPointStore<
  Model extends TimeSeriesContentModel = TimeSeriesContentModel,
  TDataPointModel extends DataPointModel = DataPointModel,
> {
  protected models: Map<string, Model> = new Map();
  protected dataPoints: Map<string, Map<string, TDataPointModel>> = new Map();

  constructor(models?: Model[], dataPoints?: TDataPointModel[]) {
    if (models?.length) this.setModels(models);
    if (dataPoints?.length) this.setDataPoints(dataPoints);
  }

  createDataPoint(model: Model, tid: string): TDataPointModel {
    return <TDataPointModel>useDataPointStrategyFacade().createDataPoint({
      id: undefined,
      value: undefined,
      cid: model.id,
      interval: model.timeSeriesConfig.interval,
      valueType: model.timeSeriesConfig.valueType,
      date: new Date(),
      tid,
    });
  }

  reset() {
    this.models = new Map();
    this.dataPoints = new Map();
  }

  sort(models: Model[]): Model[] {
    return models.sort(sortBySortOrder);
  }

  protected getId(model: TimeSeriesContentIdentity) {
    if (typeof model === 'string') return model;

    return model.id.toString();
  }

  setModel(model: Model) {
    this.models.set(this.getId(model), model);
  }

  setModels(models: Model[]) {
    const newModel = new Map(models.map((model) => [this.getId(model), model]));
    this.models = new Map([...this.models, ...newModel]);
  }

  getModel(model: TimeSeriesContentIdentity): Model {
    if (!this.hasModel(model)) {
      return null;
    }

    return this.models.get(this.getId(model));
  }

  getModels() {
    return Array.from(this.models.values());
  }

  hasModel(model: TimeSeriesContentIdentity) {
    return this.models.has(this.getId(model));
  }

  getModelsByIntervalFilter(
    interval: CalendarIntervalEnum,
    filter?: ContentFilter<Model, any>,
    tid?: string,
  ) {
    return this.filterModels((entry) => {
      return entry.timeSeriesConfig.interval === interval && (!filter || filter.check(entry));
    });
  }

  filterModels(filter: (entry: Model, index: number, arr: Model[]) => boolean): Model[] {
    return this.sort(Array.from(this.models.values()).filter(filter));
  }

  setDataPoint(log: TDataPointModel) {
    this._setDataPoint(log, this.dataPoints);
  }

  setDataPoints(logs: TDataPointModel[]) {
    const update = new Map([...this.dataPoints]);

    logs.forEach((log) => {
      this._setDataPoint(log, update);
    });

    this.dataPoints = update;
  }

  private _setDataPoint(log: TDataPointModel, logs: Map<string, Map<string, TDataPointModel>>) {
    const modelId = log.cid;

    if (!modelId) return;

    if (!logs.has(modelId)) {
      logs.set(modelId, new Map());
    }

    logs.get(modelId).set(log.tid, log);
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

    return this.dataPoints.get(modelId).get(timingId);
  }

  getDataPoints() {
    return Array.from(this.dataPoints.values());
  }

  hasDataPoint(identity: TimeSeriesContentIdentity, timingId: string) {
    const modelId = this.getId(identity);
    if (!this.dataPoints.has(modelId)) {
      return false;
    }

    return this.dataPoints.get(modelId).has(timingId);
  }
}

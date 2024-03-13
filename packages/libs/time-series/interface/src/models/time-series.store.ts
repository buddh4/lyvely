import { DataPointModel } from './data-point.model';
import { TimeSeriesContentModel } from './time-series-content.model';
import { useDataPointStrategyFacade } from '../components';
import { CalendarPlanStore } from '@lyvely/calendar-plan-interface';
import { ITimeSeriesCalendarPlanResponse } from '../interfaces';

type TimeSeriesContentIdentity = TimeSeriesContentModel | string;

/**
 * This class is used to stores time series content and related data points.
 */
export class TimeSeriesStore<
  TModel extends TimeSeriesContentModel = TimeSeriesContentModel,
  TDataPointModel extends DataPointModel = DataPointModel,
  TResponse extends ITimeSeriesCalendarPlanResponse<
    TModel,
    TDataPointModel
  > = ITimeSeriesCalendarPlanResponse<TModel, TDataPointModel>,
> extends CalendarPlanStore<TModel, TResponse> {
  protected dataPoints: Map<string, Map<string, TDataPointModel>> = new Map();

  constructor(models?: TModel[], dataPoints?: TDataPointModel[]) {
    super(models);
    if (dataPoints?.length) this.setDataPoints(dataPoints);
  }

  override handleResponse(response: TResponse) {
    super.handleResponse(response);
    this.setDataPoints(response.dataPoints);
  }

  createDataPoint(model: TModel, tid: string): TDataPointModel {
    return <TDataPointModel>useDataPointStrategyFacade().createDataPoint({
      id: undefined as any,
      value: undefined,
      cid: model.id,
      interval: model.timeSeriesConfig.interval,
      valueType: model.timeSeriesConfig.valueType,
      date: new Date(),
      tid,
    });
  }

  override reset() {
    super.reset();
    this.dataPoints = new Map();
  }

  setDataPoint(dataPoint: TDataPointModel) {
    this._setDataPoint(dataPoint, this.dataPoints);
  }

  setDataPoints(dataPoints?: TDataPointModel[]) {
    if (!dataPoints) return;

    const update = new Map([...this.dataPoints]);

    dataPoints.forEach((dataPoint) => {
      this._setDataPoint(dataPoint, update);
    });

    this.dataPoints = update;
  }

  private _setDataPoint(
    dataPoint: TDataPointModel,
    dataPoints: Map<string, Map<string, TDataPointModel>>,
  ) {
    const modelId = dataPoint.cid;

    if (!modelId) return;

    if (!dataPoints.has(modelId)) {
      dataPoints.set(modelId, new Map());
    }

    dataPoints.get(modelId)?.set(dataPoint.tid, dataPoint);
  }

  getDataPoint(
    identity: TimeSeriesContentIdentity,
    timingId: string,
    create = false,
  ): TDataPointModel | null {
    const modelId = this.getId(identity);
    if (!this.hasDataPoint(modelId, timingId)) {
      if (!create) return null;

      const model = this.getModel(modelId);
      if (!model) return null;

      // Add and fetch dataPoint in order to return a reactive instance
      this.setDataPoint(this.createDataPoint(model, timingId));
      return this.getDataPoint(model, timingId);
    }

    return this.dataPoints.get(modelId)?.get(timingId) || null;
  }

  getDataPoints() {
    return Array.from(this.dataPoints.values());
  }

  hasDataPoint(identity: TimeSeriesContentIdentity, timingId: string) {
    const modelId = this.getId(identity);
    if (!this.dataPoints.has(modelId)) {
      return false;
    }

    return !!this.dataPoints.get(modelId)?.has(timingId);
  }
}

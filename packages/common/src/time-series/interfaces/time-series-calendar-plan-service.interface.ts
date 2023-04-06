import { DataPointModel, IDataPoint, ITimeSeriesContentModel } from '@/time-series';
import { ICalendarPlanService } from '@/calendar-plan';

export interface ITimeSeriesCalendarPlanResponse<
  TModel extends ITimeSeriesContentModel,
  TDataModel extends DataPointModel = DataPointModel,
> {
  models: Array<TModel>;
  dataPoints: Array<TDataModel>;
}

export interface ITimeSeriesCalendarPlanService<
  TModel extends ITimeSeriesContentModel,
  TDataModel extends DataPointModel = DataPointModel,
  TResponse extends ITimeSeriesCalendarPlanResponse<
    TModel,
    TDataModel
  > = ITimeSeriesCalendarPlanResponse<TModel, TDataModel>,
> extends ICalendarPlanService<TModel, TResponse> {}

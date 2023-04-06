import { ITimeSeriesContent } from './time-series-content.interface';
import { ICalendarPlanService } from '@/calendar-plan';
import { IDataPoint } from './data-point.interface';

export interface ITimeSeriesCalendarPlanResponse<
  TModel extends ITimeSeriesContent,
  TDataModel extends IDataPoint = IDataPoint,
> {
  models: Array<TModel>;
  dataPoints: Array<TDataModel>;
}

export interface ITimeSeriesCalendarPlanService<
  TModel extends ITimeSeriesContent,
  TDataModel extends IDataPoint = IDataPoint,
  TResponse extends ITimeSeriesCalendarPlanResponse<
    TModel,
    TDataModel
  > = ITimeSeriesCalendarPlanResponse<TModel, TDataModel>,
> extends ICalendarPlanService<TModel, TResponse> {}

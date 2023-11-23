import { ITimeSeriesContent } from './time-series-content.interface';
import { ICalendarPlanClient } from '@lyvely/calendar-plan-interface';
import { IDataPoint } from './data-point.interface';
import { IUpdateDataPoint, IUpdateDataPointResponse } from './update-data-point.interface';

export interface ITimeSeriesCalendarPlanResponse<
  TModel extends ITimeSeriesContent,
  TDataModel extends IDataPoint = IDataPoint,
> {
  models: Array<TModel>;
  dataPoints: Array<TDataModel>;
}

export interface ITimeSeriesCalendarPlanClient<
  TModel extends ITimeSeriesContent,
  TDataModel extends IDataPoint = IDataPoint,
  TResponse extends ITimeSeriesCalendarPlanResponse<
    TModel,
    TDataModel
  > = ITimeSeriesCalendarPlanResponse<TModel, TDataModel>,
> extends ICalendarPlanClient<TModel, TResponse> {
  updateDataPoint(cid: string, update: IUpdateDataPoint): Promise<IUpdateDataPointResponse>;
}

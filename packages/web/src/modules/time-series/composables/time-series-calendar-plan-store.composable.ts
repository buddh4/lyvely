import {
  ContentFilter,
  DataPointModel,
  TimeSeriesContentModel,
  TimeSeriesStore,
  ITimeSeriesCalendarPlanResponse,
} from '@lyvely/common';
import { ICalendarPlanOptions, useCalendarPlan } from '@/modules/calendar-plan';

export interface ITimeSeriesCalendarPlanOptions<
  TModel extends TimeSeriesContentModel,
  TFilter extends ContentFilter<TModel>,
  TDataPoint extends DataPointModel = DataPointModel,
  TResponse extends ITimeSeriesCalendarPlanResponse<
    TModel,
    TDataPoint
  > = ITimeSeriesCalendarPlanResponse<TModel, TDataPoint>,
  TStore extends TimeSeriesStore<TModel, TDataPoint, TResponse> = TimeSeriesStore<
    TModel,
    TDataPoint,
    TResponse
  >,
> extends ICalendarPlanOptions<TModel, TFilter, TResponse, TStore> {}

export function useTimeSeriesCalendarPlan<
  TModel extends TimeSeriesContentModel,
  TFilter extends ContentFilter<TModel>,
  TDataPoint extends DataPointModel = DataPointModel,
  TResponse extends ITimeSeriesCalendarPlanResponse<
    TModel,
    TDataPoint
  > = ITimeSeriesCalendarPlanResponse<TModel, TDataPoint>,
  TStore extends TimeSeriesStore<TModel, TDataPoint, TResponse> = TimeSeriesStore<
    TModel,
    TDataPoint,
    TResponse
  >,
>(options: ITimeSeriesCalendarPlanOptions<TModel, TFilter, TDataPoint, TResponse, TStore>) {
  return useCalendarPlan<TModel, TFilter, TResponse, TStore>(options);
}

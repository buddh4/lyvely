import { DataPointIntervalFilter, DataPointModel, TimeSeriesContentModel } from '@/time-series';
import { SortResponse } from '@/models';
import { MoveAction } from '../models';

export interface ICalendarPlanResponse<
  TModel extends TimeSeriesContentModel,
  TDataPointModel extends DataPointModel = DataPointModel,
> {
  models: TModel[];
  dataPoints: TDataPointModel[];
}

export interface ICalendarPlanService<
  TModel extends TimeSeriesContentModel,
  TDataPointModel extends DataPointModel = DataPointModel,
> {
  getByFilter(
    filter: DataPointIntervalFilter,
  ): Promise<ICalendarPlanResponse<TModel, TDataPointModel>>;
  sort(cid: string, move: MoveAction): Promise<SortResponse>;
}

import { DataPointIntervalFilter, DataPointModel, TimeSeriesContentModel } from '@/time-series';
import { SortResult } from '@/models';
import { MoveAction } from '../models';

export interface ICalendarPlanResponse<
  TModel extends TimeSeriesContentModel,
  TDataPointModel extends DataPointModel = DataPointModel,
> {
  models: TModel[];
  dataPoitns: TDataPointModel[];
}

export interface ICalendarPlanService<
  TModel extends TimeSeriesContentModel,
  TDataPointModel extends DataPointModel = DataPointModel,
> {
  getByRange(
    filter: DataPointIntervalFilter,
  ): Promise<ICalendarPlanResponse<TModel, TDataPointModel>>;
  sort(cid: string, move: MoveAction): Promise<SortResult[]>;
}

import { DataPointIntervalFilter } from '@/time-series';
import { SortResponse } from '@/models';
import { SortAction } from '../models';
import { ICalendarPlanEntry } from '@/calendar-plan';

export interface ICalendarPlanResponse<TModel extends ICalendarPlanEntry> {
  models: TModel[];
}

export interface ICalendarPlanService<
  TModel extends ICalendarPlanEntry,
  TResponse extends ICalendarPlanResponse<TModel> = ICalendarPlanResponse<TModel>,
> {
  getByFilter(filter: DataPointIntervalFilter): Promise<TResponse>;
  sort(cid: string, move: SortAction): Promise<SortResponse>;
}

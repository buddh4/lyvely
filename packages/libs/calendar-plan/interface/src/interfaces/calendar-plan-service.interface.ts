import { ICalendarPlanEntry } from './calendar-plan-entry.interface';
import { SortResponse } from '@lyvely/interface';
import { CalendarInterval } from '@lyvely/dates';

export interface ICalendarPlanResponse<TModel extends ICalendarPlanEntry> {
  models: TModel[];
}

export interface ICalendarPlanSort {
  attachToId?: string;
  interval: CalendarInterval;
}

export interface ICalendarPlanFilter {
  date?: string;
  level: CalendarInterval;
}

export interface ICalendarPlanClient<
  TModel extends ICalendarPlanEntry,
  TResponse extends ICalendarPlanResponse<TModel> = ICalendarPlanResponse<TModel>,
> {
  getByFilter(filter: ICalendarPlanFilter): Promise<TResponse>;
  sort(cid: string, move: ICalendarPlanSort): Promise<SortResponse>;
}

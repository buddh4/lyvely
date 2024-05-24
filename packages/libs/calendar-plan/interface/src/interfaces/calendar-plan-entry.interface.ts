import { IContent } from '@lyvely/interface';
import { CalendarInterval } from '@lyvely/dates';
import type { IContentDataType } from '@lyvely/interface';

export interface ICalendarPlanEntry<
  TID = string,
  TConfig extends Object | undefined = any,
  TState extends Object | undefined = any,
  TData extends IContentDataType = IContentDataType,
> extends IContent<TID, TConfig, TState, TData> {
  get interval(): CalendarInterval;
  set interval(interval: CalendarInterval);
}

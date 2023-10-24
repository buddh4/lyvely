import { IContent } from '@lyvely/core-interface';
import { CalendarInterval } from '@lyvely/dates';

export interface ICalendarPlanEntry<TID = string> extends IContent<TID> {
  get interval(): CalendarInterval;
  set interval(interval: CalendarInterval);
}

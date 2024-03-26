import { IContent } from '@lyvely/interface';
import { CalendarInterval } from '@lyvely/dates';

export interface ICalendarPlanEntry<TID = string> extends IContent<TID> {
  get interval(): CalendarInterval;
  set interval(interval: CalendarInterval);
}

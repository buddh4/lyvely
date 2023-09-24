import { IContent } from '@lyvely/content-interface';
import { CalendarInterval } from '@lyvely/dates';

export interface ICalendarPlanEntry extends IContent {
  get interval(): CalendarInterval;
  set interval(interval: CalendarInterval);
}

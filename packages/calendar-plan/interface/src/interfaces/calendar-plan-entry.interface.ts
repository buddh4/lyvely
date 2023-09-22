import { IContent } from '@lyvely/content';
import { CalendarInterval } from '@lyvely/dates';

export interface ICalendarPlanEntry extends IContent {
  get interval(): CalendarInterval;
  set interval(interval: CalendarInterval);
}

import { IContent } from '@/content';
import { CalendarInterval } from '@/calendar';

export interface ICalendarPlanEntry extends IContent {
  get interval(): CalendarInterval;
  set interval(interval: CalendarInterval);
}

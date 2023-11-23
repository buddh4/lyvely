import { ICalendarPlanEntry } from '@lyvely/calendar-plan-interface';
import { Content, BaseDocument, TObjectId } from '@lyvely/api';

export type CalendarPlanEntity = ICalendarPlanEntry<TObjectId> &
  Content<ICalendarPlanEntry<TObjectId> & BaseDocument<ICalendarPlanEntry<TObjectId>>>;

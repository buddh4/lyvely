import { ICalendarPlanEntry } from '@lyvely/calendar-plan-interface';
import { Content, BaseEntity, TObjectId } from '@lyvely/api';

export type CalendarPlanEntity = ICalendarPlanEntry<TObjectId> &
  Content<ICalendarPlanEntry<TObjectId> & BaseEntity<ICalendarPlanEntry<TObjectId>>>;

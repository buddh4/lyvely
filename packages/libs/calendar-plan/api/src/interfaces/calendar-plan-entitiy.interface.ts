import { ICalendarPlanEntry } from '@lyvely/calendar-plan-interface';
import { Content, BaseDocument, TObjectId } from '@lyvely/api';

export type CalendarPlanEntity = BaseDocument &
  ICalendarPlanEntry<TObjectId> &
  Content<any, any, any>;

import { ICalendarPlanEntry } from '@lyvely/calendar-plan-interface';
import { Content } from '@lyvely/content';
import { BaseEntity } from '@lyvely/core';

export type CalendarPlanEntity = ICalendarPlanEntry &
  Content<ICalendarPlanEntry & BaseEntity<ICalendarPlanEntry>>;

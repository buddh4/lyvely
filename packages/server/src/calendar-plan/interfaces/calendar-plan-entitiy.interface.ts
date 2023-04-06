import { ICalendarPlanEntry } from '@lyvely/common';
import { Content } from '@/content';
import { BaseEntity } from '@/core';

export type CalendarPlanEntity = ICalendarPlanEntry &
  Content<ICalendarPlanEntry & BaseEntity<ICalendarPlanEntry>>;

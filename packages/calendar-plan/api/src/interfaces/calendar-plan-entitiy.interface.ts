import { ICalendarPlanEntry } from '@lyvely/common';
import { Content } from '@lyvely/content';
import { BaseEntity } from '@lyvely/core';

export type CalendarPlanEntity = ICalendarPlanEntry &
  Content<ICalendarPlanEntry & BaseEntity<ICalendarPlanEntry>>;

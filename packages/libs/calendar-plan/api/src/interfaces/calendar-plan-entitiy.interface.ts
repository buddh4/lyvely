import { ICalendarPlanEntry } from '@lyvely/calendar-plan-interface';
import { Content } from '@lyvely/content';
import { BaseEntity } from '@lyvely/core';
import { Types } from 'mongoose';

export type CalendarPlanEntity = ICalendarPlanEntry<Types.ObjectId> &
  Content<ICalendarPlanEntry<Types.ObjectId> & BaseEntity<ICalendarPlanEntry<Types.ObjectId>>>;
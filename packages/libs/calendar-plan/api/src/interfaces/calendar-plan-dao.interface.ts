import { IFetchQueryOptions, Profile, ContentTypeDao } from '@lyvely/core';
import { CalendarInterval } from '@lyvely/dates';
import { CalendarPlanEntity } from './calendar-plan-entitiy.interface';

export interface ICalendarPlanDao<TModel extends CalendarPlanEntity>
  extends ContentTypeDao<TModel> {
  findByProfileAndInterval(
    profile: Profile,
    plan: CalendarInterval,
    options: IFetchQueryOptions<TModel>,
  ): Promise<TModel[]>;
}

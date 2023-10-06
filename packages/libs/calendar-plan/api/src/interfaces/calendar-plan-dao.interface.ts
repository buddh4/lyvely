import { Profile } from '@lyvely/profiles';
import { IFetchQueryOptions } from '@lyvely/core';
import { CalendarInterval } from '@lyvely/dates';
import { CalendarPlanEntity } from './calendar-plan-entitiy.interface';
import { ContentTypeDao } from '@lyvely/content';

export interface ICalendarPlanDao<TModel extends CalendarPlanEntity>
  extends ContentTypeDao<TModel> {
  findByProfileAndInterval(
    profile: Profile,
    plan: CalendarInterval,
    options: IFetchQueryOptions<TModel>,
  ): Promise<TModel[]>;
}

import { Profile } from '@/profiles';
import { IFetchQueryOptions } from '@/core';
import { CalendarInterval } from '@lyvely/common';
import { CalendarPlanEntity } from './calendar-plan-entitiy.interface';
import { AbstractContentDao } from '@/content';

export interface CalendarPlanDao<TModel extends CalendarPlanEntity>
  extends AbstractContentDao<TModel> {
  findByProfileAndInterval(
    profile: Profile,
    plan: CalendarInterval,
    options: IFetchQueryOptions<TModel>,
  ): Promise<TModel[]>;
}

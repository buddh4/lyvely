import { Profile } from '@/profiles';
import { IFetchQueryOptions } from '@lyvely/server-core';
import { CalendarInterval } from '@lyvely/common';
import { CalendarPlanEntity } from './calendar-plan-entitiy.interface';
import { ContentTypeDao } from '@/content';

export interface CalendarPlanDao<TModel extends CalendarPlanEntity> extends ContentTypeDao<TModel> {
  findByProfileAndInterval(
    profile: Profile,
    plan: CalendarInterval,
    options: IFetchQueryOptions<TModel>,
  ): Promise<TModel[]>;
}

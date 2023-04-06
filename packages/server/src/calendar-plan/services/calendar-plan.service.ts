import { Profile } from '@/profiles';
import { User } from '@/users';
import { CalendarPlanFilter } from '@lyvely/common';
import { CalendarPlanDao, CalendarPlanEntity } from '@/calendar-plan/interfaces';

export abstract class CalendarPlanService<TModel extends CalendarPlanEntity> {
  protected abstract contentDao: CalendarPlanDao<TModel>;

  abstract findByFilter(
    profile: Profile,
    user: User,
    filter: CalendarPlanFilter,
  ): Promise<Array<TModel>>;
}

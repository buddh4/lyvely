import { Profile } from '@lyvely/profiles';
import { User } from '@lyvely/users';
import { CalendarPlanFilter } from '@lyvely/common';
import { CalendarPlanDao, CalendarPlanEntity } from '@lyvely/calendar-plan';

export abstract class CalendarPlanService<TModel extends CalendarPlanEntity> {
  protected abstract contentDao: CalendarPlanDao<TModel>;

  abstract findByFilter(
    profile: Profile,
    user: User,
    filter: CalendarPlanFilter,
  ): Promise<Array<TModel>>;
}

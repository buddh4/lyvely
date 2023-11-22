import { Profile, User } from '@lyvely/api';
import { CalendarPlanFilter } from '@lyvely/calendar-plan-interface';
import { ICalendarPlanDao, CalendarPlanEntity } from '../interfaces';

export abstract class CalendarPlanService<TModel extends CalendarPlanEntity> {
  protected abstract contentDao: ICalendarPlanDao<TModel>;

  abstract findByFilter(
    profile: Profile,
    user: User,
    filter: CalendarPlanFilter,
  ): Promise<Array<TModel>>;
}

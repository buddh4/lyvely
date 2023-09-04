import { Injectable, Inject } from '@nestjs/common';
import { Task } from '../schemas';
import { Profile } from '@lyvely/profiles';
import { CalendarInterval, CalendarPlanFilter, getTimingIds } from '@lyvely/common';
import { User } from '@lyvely/users';
import { TasksDao } from '../daos';
import { SortableCalendarPlanService } from '@lyvely/calendar-plan';

@Injectable()
export class TaskCalendarPlanService extends SortableCalendarPlanService<Task> {
  @Inject()
  protected contentDao: TasksDao;

  findByFilter(profile: Profile, user: User, filter: CalendarPlanFilter): Promise<Array<Task>> {
    return this.contentDao.findByProfileAndTimingIds(
      profile,
      user,
      getTimingIds(filter.date, profile.locale, filter.level),
    );
  }

  protected async updateIntervalConfig(
    profile: Profile,
    model: Task,
    interval: CalendarInterval,
  ): Promise<void> {
    await this.contentDao.updateOneByProfileAndIdSet(profile, model, {
      'config.interval': interval,
    });
    model.config.interval = interval;
  }
}

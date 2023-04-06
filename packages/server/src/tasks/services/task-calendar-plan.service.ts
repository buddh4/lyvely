import { Injectable, Inject } from '@nestjs/common';
import { Task } from '../schemas';
import { Profile } from '@/profiles';
import { CalendarInterval, CalendarPlanFilter, getTimingIds } from '@lyvely/common';
import { User } from '@/users';
import { TasksDao } from '../daos';
import { SortableCalendarPlanService } from '@/calendar-plan';

@Injectable()
export class TaskCalendarPlanService extends SortableCalendarPlanService<Task> {
  @Inject()
  protected contentDao: TasksDao;

  findByFilter(profile: Profile, user: User, filter): Promise<Array<Task>> {
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

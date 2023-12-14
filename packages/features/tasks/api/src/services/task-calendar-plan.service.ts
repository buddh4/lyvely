import { Injectable, Inject } from '@nestjs/common';
import { Task } from '../schemas';
import { Profile, ProfileContext } from '@lyvely/api';
import { CalendarInterval, getTimingIds } from '@lyvely/dates';
import { CalendarPlanFilter, SortableCalendarPlanService } from '@lyvely/calendar-plan';
import { TasksDao } from '../daos';

@Injectable()
export class TaskCalendarPlanService extends SortableCalendarPlanService<Task> {
  @Inject()
  protected contentDao: TasksDao;

  findByFilter(profileContext: ProfileContext, filter: CalendarPlanFilter): Promise<Array<Task>> {
    const { user, profile } = profileContext;
    return this.contentDao.findByProfileAndTimingIds(
      profile,
      user,
      getTimingIds(filter.date, profile.locale, filter.level, profile.settings?.calendar),
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

import { Injectable, Inject } from '@nestjs/common';
import { Task } from '../schemas';
import { Profile } from '@lyvely/core';
import { CalendarInterval, getTimingIds } from '@lyvely/dates';
import { CalendarPlanFilter, SortableCalendarPlanService } from '@lyvely/calendar-plan';
import { OptionalUser } from '@lyvely/core';
import { TasksDao } from '../daos';

@Injectable()
export class TaskCalendarPlanService extends SortableCalendarPlanService<Task> {
  @Inject()
  protected contentDao: TasksDao;

  findByFilter(
    profile: Profile,
    user: OptionalUser,
    filter: CalendarPlanFilter,
  ): Promise<Array<Task>> {
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

import { Injectable, Inject } from '@nestjs/common';
import { Task } from '../schemas';
import { Profile } from '@lyvely/api';
import { CalendarInterval } from '@lyvely/dates';
import { SortableCalendarPlanService } from '@lyvely/calendar-plan';
import { TasksDao } from '../daos';

@Injectable()
export class TaskCalendarPlanService extends SortableCalendarPlanService<Task> {
  @Inject()
  protected contentDao: TasksDao;

  protected async updateIntervalConfig(
    profile: Profile,
    model: Task,
    interval: CalendarInterval
  ): Promise<void> {
    await this.contentDao.updateOneByProfileAndIdSet(profile, model, {
      'config.interval': interval,
    });
    model.config.interval = interval;
  }
}

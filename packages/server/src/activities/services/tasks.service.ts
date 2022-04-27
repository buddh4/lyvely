import { Injectable } from '@nestjs/common';
import { Task } from '../schemas';
import { Profile } from '../../profiles/schemas/profiles.schema';
import { Calendar, CalendarDate } from 'lyvely-common';
import { HabitDataPointService } from './habit-data-point.service';
import { User } from '../../users/schemas/users.schema';
import { TasksDao } from '../daos/tasks.dao';
import { AbstractContentService } from '../../content/services/abstract-content.service';

@Injectable()
export class TasksService extends AbstractContentService<Task> {
  constructor(
    private tasksDao: TasksDao,
    private activityLogsService: HabitDataPointService
  ) {
    super(tasksDao);
  }

  async setDone(user: User, profile: Profile, task: Task, date: CalendarDate): Promise<Task> {
    const timing = Calendar.createTiming(task.interval, date, profile.getLocale());

    task.done = timing._id;
    await this.tasksDao.setDone(task, timing._id);
    await this.activityLogsService.updateOrCreateDataPoint(user, profile, task, date, 1);

    return task;
  }

  async setUnDone(user: User, profile: Profile, task: Task, date: CalendarDate): Promise<Task> {
    task.done = undefined;
    await this.tasksDao.setUndone(task);
    await this.activityLogsService.deleteLog(user, profile, task, date);
    return task;
  }
}

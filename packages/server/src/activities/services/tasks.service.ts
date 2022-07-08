import { Injectable } from '@nestjs/common';
import { Task } from '../schemas';
import { Profile } from '../../profiles';
import { Calendar, CalendarDate } from 'lyvely-common';
import { HabitDataPointService } from './habit-data-point.service';
import { User } from '../../users';
import { TasksDao } from '../daos/tasks.dao';
import { AbstractContentService, ContentScoreService } from '../../content';
import { toTimingId } from "lyvely-common/src";
import { ActivityScore } from "../schemas/activity-score.schema";

@Injectable()
export class TasksService extends AbstractContentService<Task> {
  constructor(
    private tasksDao: TasksDao,
    private scoreService: ContentScoreService
  ) {
    super(tasksDao);
  }

  async setDone(user: User, profile: Profile, task: Task, date: CalendarDate): Promise<Task> {
    await this.tasksDao.setDone(task, toTimingId(date, task.interval));
    await this.scoreService.saveScore(profile, new ActivityScore({
      profile,
      user,
      content: task,
      userStrategy: task.userStrategy,
      score: task.score,
      date: date
    }));

    return task;
  }

  async setUnDone(user: User, profile: Profile, task: Task, date: CalendarDate): Promise<Task> {
    await this.tasksDao.setUndone(task);
    await this.scoreService.saveScore(profile, new ActivityScore({
      profile,
      user,
      content: task,
      userStrategy: task.userStrategy,
      score: task.score,
      date: date
    }));
    return task;
  }
}

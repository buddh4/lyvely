import { Injectable } from '@nestjs/common';
import { Task } from '../schemas';
import { Profile } from '@/profiles';
import { CalendarDate, toTimingId } from '@lyvely/common';
import { User } from '@/users';
import { TasksDao } from '../daos/tasks.dao';
import { AbstractContentService, ContentScoreService } from '@/content';
import { ActivityScore } from '../schemas/activity-score.schema';

@Injectable()
export class TasksService extends AbstractContentService<Task> {
  constructor(protected contentDao: TasksDao, private scoreService: ContentScoreService) {
    super(contentDao);
  }

  async createContent(profile: Profile, user: User, model: Task, tagNames?: string[]): Promise<Task> {
    model.meta.sortOrder = await this.contentDao.getNextSortOrder(profile);
    return super.createContent(profile, user, model, tagNames);
  }

  async setDone(profile: Profile, user: User, task: Task, date: CalendarDate): Promise<Task> {
    const wasDone = task.isDone(user);
    await this.contentDao.setDone(profile, task, user, toTimingId(date, task.dataPointConfig.interval));
    if (!wasDone) {
      await this.scoreService.saveScore(
        profile,
        new ActivityScore({
          profile,
          user,
          content: task,
          userStrategy: task.userStrategy,
          score: task.score,
          date: date,
        }),
      );
    }

    return task;
  }

  async setUndone(profile: Profile, user: User, task: Task, date: CalendarDate): Promise<Task> {
    await this.contentDao.setUndone(profile, task, user);
    await this.scoreService.saveScore(
      profile,
      new ActivityScore({
        profile,
        user,
        content: task,
        userStrategy: task.userStrategy,
        score: -task.score,
        date: date,
      }),
    );
    return task;
  }
}

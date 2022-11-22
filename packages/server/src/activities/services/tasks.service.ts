import { Injectable } from '@nestjs/common';
import { Task } from '../schemas';
import { Profile } from '@/profiles';
import { CalendarDate, toTimingId, UserAssignmentStrategy } from '@lyvely/common';
import { User } from '@/users';
import { TasksDao } from '../daos/tasks.dao';
import { AbstractContentService, ContentScoreService } from '@/content';
import { ActivityScore } from '../schemas/activity-score.schema';
import { assureObjectId, EntityIdentity } from '@/core';
import { Timer } from '@/calendar';

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

    const timingId = toTimingId(date, task.dataPointConfig.interval);
    const doneBy = { uid: assureObjectId(user), tid: timingId, date: new Date() };
    const isDoneByUser = task.isDoneByUser(user);

    if (task.userStrategy === UserAssignmentStrategy.Shared) {
      await this.contentDao.updateOneByProfileAndIdSet(profile, task, { doneBy: [doneBy] });
    } else if (!isDoneByUser) {
      await this.contentDao.updateOneByProfileAndId(profile, task, { $push: { doneBy: doneBy } });
    } else {
      await this.contentDao.updateDoneBy(profile, task, user, doneBy);
    }

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
    const wasDone = task.isDone(user);

    if (task.userStrategy === UserAssignmentStrategy.Shared) {
      await this.contentDao.updateOneByProfileAndIdSet(profile, task, { doneBy: [] });
    } else {
      await this.contentDao.pullDoneBy(profile, task, user);
    }

    task.setUndoneBy(user);

    if (wasDone) {
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
    }

    return task;
  }

  async startTimer(profile: Profile, user: EntityIdentity<User>, task: Task): Promise<Timer> {
    let timer = task.getTimer(user);

    if (!timer) {
      timer = new Timer(user);
    }

    if (timer.isStarted()) return timer;

    timer.start(user);

    await this.updateTimer(profile, user, task, timer);
    return timer;
  }

  async stopTimer(profile: Profile, user: EntityIdentity<User>, task: Task): Promise<Timer> {
    const timer = task.getTimer(user);

    if (!timer) return new Timer();
    if (!timer.isStarted()) return timer;

    timer.stop();

    await this.updateTimer(profile, user, task, timer);
    return timer;
  }

  async updateTimerValue(profile: Profile, user: EntityIdentity<User>, task: Task, value: number): Promise<Timer> {
    let timer = task.getTimer(user);

    if (!timer) {
      timer = new Timer(user);
    }

    timer.overwrite(value, user);

    await this.updateTimer(profile, user, task, timer);
    return timer;
  }

  private async updateTimer(profile: Profile, user: EntityIdentity<User>, task: Task, timer: Timer) {
    if (task.userStrategy === UserAssignmentStrategy.Shared) {
      return this.contentDao.updateOneByProfileAndIdSet(profile, task, { timers: [timer] });
    }

    const hasTimer = !!task.getTimer(user);
    if (!hasTimer) {
      return this.contentDao.updateOneByProfileAndId(profile, task, { $push: { timers: timer } });
    }

    return this.contentDao.updateUserTimer(profile, task, user, timer);
  }
}

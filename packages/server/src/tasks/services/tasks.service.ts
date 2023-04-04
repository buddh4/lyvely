import { Injectable, Inject, Logger } from '@nestjs/common';
import { Task, TaskScore } from '../schemas';
import { Profile } from '@/profiles';
import {
  CalendarDate,
  CreateTaskModel,
  toTimingId,
  UpdateTaskModel,
  UserAssignmentStrategy,
} from '@lyvely/common';
import { User } from '@/users';
import { TasksDao } from '../daos';
import { AbstractContentTypeService, ContentScoreService } from '@/content';
import { assureObjectId, EntityIdentity } from '@/core';
import { Timer } from '@/calendar';

@Injectable()
export class TasksService extends AbstractContentTypeService<Task, CreateTaskModel> {
  @Inject()
  protected contentDao: TasksDao;

  @Inject()
  private scoreService: ContentScoreService;

  protected logger = new Logger(TasksService.name);

  protected async createInstance(
    profile: Profile,
    user: User,
    model: CreateTaskModel,
  ): Promise<Task> {
    const instance = Task.create(profile, user, model);
    instance.meta.sortOrder = await this.contentDao.getNextSortOrder(profile);
    return instance;
  }

  protected async createUpdate(
    profile: Profile,
    user: User,
    content: Task,
    model: UpdateTaskModel,
  ) {
    return content.applyUpdate(model);
  }

  async setDone(profile: Profile, user: User, task: Task, date: CalendarDate): Promise<Task> {
    const wasDone = task.isDone(user);

    const timingId = toTimingId(date, task.timeSeriesConfig.interval, profile.locale);
    const doneBy = { uid: assureObjectId(user), tid: timingId, date: new Date() };
    const isDoneByUser = task.isDoneByUser(user);

    if (task.timeSeriesConfig.userStrategy === UserAssignmentStrategy.Shared) {
      await this.updateContentSet(profile, user, task, { doneBy: [doneBy] }, { streamSort: true });
    } else if (!isDoneByUser) {
      await this.contentDao.updateOneByProfileAndId(profile, task, { $push: { doneBy: doneBy } });
    } else {
      await this.contentDao.updateDoneBy(profile, task, user, doneBy);
    }

    if (!wasDone) {
      await this.scoreService.saveScore(
        profile,
        new TaskScore({
          profile,
          user,
          content: task,
          userStrategy: task.timeSeriesConfig.userStrategy,
          score: task.config.score,
          date: date,
        }),
      );
    }

    return task;
  }

  async setUndone(profile: Profile, user: User, task: Task, date: CalendarDate): Promise<Task> {
    const wasDone = task.isDone(user);

    if (task.timeSeriesConfig.userStrategy === UserAssignmentStrategy.Shared) {
      await this.updateContentSet(
        profile,
        user,
        task,
        {
          doneBy: [],
        },
        { streamSort: true },
      );
    } else {
      await this.contentDao.pullDoneBy(profile, task, user);
    }

    task.setUndoneBy(user);

    if (wasDone) {
      await this.scoreService.saveScore(
        profile,
        new TaskScore({
          profile,
          user,
          content: task,
          userStrategy: task.timeSeriesConfig.userStrategy,
          score: -task.config.score,
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

  async updateTimerValue(
    profile: Profile,
    user: EntityIdentity<User>,
    task: Task,
    value: number,
  ): Promise<Timer> {
    let timer = task.getTimer(user);

    if (!timer) {
      timer = new Timer(user);
    }

    timer.overwrite(value, user);

    await this.updateTimer(profile, user, task, timer);
    return timer;
  }

  private async updateTimer(
    profile: Profile,
    user: EntityIdentity<User>,
    task: Task,
    timer: Timer,
  ) {
    if (task.timeSeriesConfig.userStrategy === UserAssignmentStrategy.Shared) {
      return this.contentDao.updateOneByProfileAndIdSet(profile, task, { timers: [timer] });
    }

    const hasTimer = !!task.getTimer(user);
    if (!hasTimer) {
      return this.contentDao.updateOneByProfileAndId(profile, task, { $push: { timers: timer } });
    }

    return this.contentDao.updateUserTimer(profile, task, user, timer);
  }
}

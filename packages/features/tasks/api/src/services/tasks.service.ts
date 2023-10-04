import { Injectable, Inject, Logger } from '@nestjs/common';
import { Task, TaskScore } from '../schemas';
import { Profile } from '@lyvely/profiles';
import { CalendarDate, toTimingId } from '@lyvely/dates';
import { Timer } from '@lyvely/timers';
import { CreateTaskModel, UpdateTaskModel } from '@lyvely/tasks-interface';
import { UserAssignmentStrategy } from '@lyvely/common';
import { User } from '@lyvely/users';
import { TasksDao } from '../daos';
import { ContentTypeService, ContentScoreService } from '@lyvely/content';
import { assureObjectId, EntityIdentity } from '@lyvely/core';

@Injectable()
export class TasksService extends ContentTypeService<Task, CreateTaskModel> {
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

  protected async createUpdate(profile: Profile, user: User, task: Task, update: UpdateTaskModel) {
    task.applyContentUpdate({
      title: update.title ?? task.content.title,
      text: update.text ?? task.content.text,
    });

    task.config.interval = update.interval ?? task.config.interval;
    task.config.userStrategy = update.userStrategy ?? task.config.userStrategy;

    return task;
  }

  async setDone(profile: Profile, user: User, task: Task, date: CalendarDate): Promise<Task> {
    const wasDone = task.isDone(user);

    const timingId = toTimingId(date, task.config.interval, profile.locale);
    const doneBy = { uid: assureObjectId(user), tid: timingId, date: new Date() };
    const isDoneByUser = task.isDoneByUser(user);

    if (task.config.userStrategy === UserAssignmentStrategy.Shared) {
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
          userStrategy: task.config.userStrategy,
          score: task.config.score,
          date: date,
        }),
      );
    }

    return task;
  }

  async setUndone(profile: Profile, user: User, task: Task, date: CalendarDate): Promise<Task> {
    const wasDone = task.isDone(user);

    if (task.config.userStrategy === UserAssignmentStrategy.Shared) {
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
          userStrategy: task.config.userStrategy,
          score: -task.config.score,
          date: date,
        }),
      );
    }

    return task;
  }

  async startTimer(profile: Profile, user: EntityIdentity<User>, task: Task): Promise<Timer> {
    const timer = task.getTimer(user) || new Timer(user);

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
    const timer = task.getTimer(user) || new Timer(user);

    timer.overwrite(value, assureObjectId(user));

    await this.updateTimer(profile, user, task, timer);
    return timer;
  }

  private async updateTimer(
    profile: Profile,
    user: EntityIdentity<User>,
    task: Task,
    timer: Timer,
  ) {
    if (task.config.userStrategy === UserAssignmentStrategy.Shared) {
      return this.contentDao.updateOneByProfileAndIdSet(profile, task, { timers: [timer] });
    }

    const hasTimer = !!task.getTimer(user);
    if (!hasTimer) {
      return this.contentDao.updateOneByProfileAndId(profile, task, { $push: { timers: timer } });
    }

    return this.contentDao.updateUserTimer(profile, task, user, timer);
  }
}

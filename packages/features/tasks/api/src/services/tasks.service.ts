import { Injectable, Inject, Logger } from '@nestjs/common';
import { Task, TaskScore } from '../schemas';
import {
  ContentTypeService,
  ContentScoreService,
  assureObjectId,
  UserAssignmentStrategy,
  ProtectedProfileContext,
  UpdateQuerySet,
} from '@lyvely/api';
import { CalendarDate, toTimingId } from '@lyvely/dates';
import { Timer } from '@lyvely/timers';
import { CreateTaskModel, UpdateTaskModel } from '@lyvely/tasks-interface';
import { TasksDao } from '../daos';

/**
 * A service responsible for creating, updating and fetching task documents.
 *
 * @class
 * @extends ContentTypeService<Task, CreateTaskModel>
 * @public
 */
@Injectable()
export class TasksService extends ContentTypeService<Task, CreateTaskModel> {
  /** Task content dao, responsible for data access. **/
  @Inject()
  protected contentDao: TasksDao;

  /** ContentScoreService, responsible for updating scores for completed tasks. **/
  @Inject()
  private scoreService: ContentScoreService;

  /** Class specific logger. **/
  protected logger = new Logger(TasksService.name);

  /**
   * Creates a new Task instance from the given create model.
   * This is part of the ContentTypeService template and is responsible for mapping create models to actual
   * model instances.
   *
   * @param {ProtectedProfileContext} context - The profile context.
   * @param {CreateTaskModel} model - The data for creating the task.
   * @returns {Promise<Task>} - The newly created task instance with the assigned sort order.
   * @protected
   */
  protected override async createInstance(
    context: ProtectedProfileContext,
    model: CreateTaskModel,
  ): Promise<Task> {
    const { profile } = context;
    const instance = Task.create(context, model);
    instance.meta.sortOrder = await this.contentDao.getNextSortOrder(profile);
    return instance;
  }

  /**
   * Creates and applies an update to a Task.
   * This is part of the ContentTypeService template and is responsible for mapping update models to actual
   * document updates.
   *
   * @param context
   * @param {Task} task - The task object to be updated.
   * @param {UpdateTaskModel} update - The update model containing the changes to be made.
   * @protected
   * @returns {Task} - The updated task object.
   */
  protected override async createUpdate(
    context: ProtectedProfileContext,
    task: Task,
    update: UpdateTaskModel,
  ): Promise<UpdateQuerySet<Task>> {
    task.applyContentUpdate({
      title: update.title ?? task.content.title,
      text: update.text ?? task.content.text,
    });

    task.config.interval = update.interval ?? task.config.interval;
    task.config.userStrategy = update.userStrategy ?? task.config.userStrategy;

    return task;
  }

  /**
   * Sets a task as done by a user and updates the necessary data and score.
   *
   * @param {ProtectedProfileContext} context
   * @param {Task} task - The task to be marked as done.
   * @param {CalendarDate} date - The date when the task was completed.
   * @returns {Promise<Task>} - The updated task.
   */
  async setDone(context: ProtectedProfileContext, task: Task, date: CalendarDate): Promise<Task> {
    const { user, profile } = context;
    const wasDone = task.isDone(user);

    const timingId = toTimingId(
      date,
      task.config.interval,
      profile.locale,
      profile.settings?.calendar,
    );
    const doneBy = { uid: assureObjectId(user), tid: timingId, date: new Date() };
    const isDoneByUser = task.isDoneByUser(user);

    if (task.config.userStrategy === UserAssignmentStrategy.Shared) {
      await this.updateContentSet(
        context,
        task,
        { 'state.doneBy': [doneBy] },
        { streamSort: true },
      );
    } else if (!isDoneByUser) {
      await this.contentDao.pushDoneBy(profile, task, doneBy);
    } else {
      await this.contentDao.updateDoneBy(profile, task, doneBy);
    }

    if (!wasDone) {
      await this.saveScore(context, task, date);
    }

    return task;
  }

  private async saveScore(
    context: ProtectedProfileContext,
    task: Task,
    date: CalendarDate,
    subtract = false,
  ) {
    return this.scoreService.saveScore(
      context,
      new TaskScore({
        context,
        content: task,
        userStrategy: task.config.userStrategy,
        score: subtract ? -task.config.score : task.config.score,
        date: date,
      }),
    );
  }

  /**
   * Sets a task as undone.
   *
   * @param {ProtectedProfileContext} context - The context of the user and profile.
   * @param {Task} task - The task to set as undone.
   * @param {CalendarDate} date - The date of the task.
   * @returns {Promise<Task>} - The updated task.
   */
  async setUndone(context: ProtectedProfileContext, task: Task, date: CalendarDate): Promise<Task> {
    const { user, profile } = context;
    const wasDone = task.isDone(user);

    if (task.config.userStrategy === UserAssignmentStrategy.Shared) {
      await this.updateContentSet(
        context,
        task,
        {
          'state.doneBy': [],
        },
        { streamSort: true },
      );
    } else {
      await this.contentDao.pullDoneBy(profile, task, user);
    }

    task.setUndoneBy(user);

    if (wasDone) {
      await this.saveScore(context, task, date, true);
    }

    return task;
  }

  /**
   * Starts a timer for a given task.
   *
   * @param {ProtectedProfileContext} context - The context of the user's protected profile.
   * @param {Task} task - The task for which the timer needs to be started.
   * @return {Promise<Timer>} - A promise that resolves to the started timer.
   */
  async startTimer(context: ProtectedProfileContext, task: Task): Promise<Timer> {
    const { user } = context;
    const timer = task.getTimer(user) || new Timer(user);

    if (timer.isStarted()) return timer;

    timer.start(user);

    await this.updateTimer(context, task, timer);
    return timer;
  }

  /**
   * Stops the timer associated with the given task.
   *
   * @param {ProtectedProfileContext} context - The context of the user accessing the timer.
   * @param {Task} task - The task for which the timer should be stopped.
   * @return {Promise<Timer>} - The stopped timer.
   */
  async stopTimer(context: ProtectedProfileContext, task: Task): Promise<Timer> {
    const timer = task.getTimer(context.user);

    if (!timer) return new Timer();
    if (!timer.isStarted()) return timer;

    timer.stop();

    await this.updateTimer(context, task, timer);
    return timer;
  }

  /**
   * Manually updates the value of a timer for a given task.
   *
   * @param {ProtectedProfileContext} context - The context of the user and profile.
   * @param {Task} task - The task object.
   * @param {number} value - The new value for the timer.
   * @returns {Promise<Timer>} - A promise that resolves with the updated Timer object.
   */
  async updateTimerValue(
    context: ProtectedProfileContext,
    task: Task,
    value: number,
  ): Promise<Timer> {
    const { user } = context;
    const timer = task.getTimer(user) || new Timer(user);

    timer.overwrite(value, assureObjectId(user));

    await this.updateTimer(context, task, timer);
    return timer;
  }

  /**
   * Updates the timer for a given task.
   *
   * @param {ProtectedProfileContext} context - The context of the current user.
   * @param {Task} task - The task to update the timer for.
   * @param {Timer} timer - The new timer value.
   * @returns {Promise<void>} - A Promise that resolves once the timer has been updated.
   * @private
   */
  private async updateTimer(context: ProtectedProfileContext, task: Task, timer: Timer) {
    const { user, profile } = context;
    if (task.config.userStrategy === UserAssignmentStrategy.Shared) {
      return this.contentDao.updateOneByProfileAndIdSet(profile, task, { 'state.timers': [timer] });
    }

    const hasTimer = !!task.getTimer(user);
    if (!hasTimer) {
      return this.contentDao.updateOneByProfileAndId(profile, task, {
        $push: { 'state.timers': timer },
      });
    }

    return this.contentDao.updateUserTimer(profile, task, user, timer);
  }
}

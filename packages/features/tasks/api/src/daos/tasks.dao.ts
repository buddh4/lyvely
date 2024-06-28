import { Task, UserDone } from '../schemas';
import {
  assureObjectId,
  DocumentIdentity,
  IFetchQueryOptions,
  User,
  Profile,
  ProfileType,
  UserAssignmentStrategy,
  Timer,
  ProfileDao,
} from '@lyvely/api';
import { ICalendarPlanDao, CalendarPlanDao } from '@lyvely/calendar-plan';
import { findAndReplace } from '@lyvely/common';
import type { ICalendarPlanTidSearchFilter } from '@lyvely/calendar-plan';
import { type FilterQuery, ProfileContext } from '@lyvely/api';

@ProfileDao(Task)
export class TasksDao extends CalendarPlanDao<Task> implements ICalendarPlanDao<Task> {
  /**
   * Defines the document query path of the interval field.
   */
  override intervalPath = 'config.interval';

  /**
   * Finds all tasks by given tid filter.
   * Completed tasks will only be included in case they were within the given timing ids filter while respecting
   * the userStrategy of the task.
   *
   * @param context
   * @param filter
   * @param options
   */
  override async findByTimingIds(
    context: ProfileContext,
    filter: ICalendarPlanTidSearchFilter,
    options?: IFetchQueryOptions<Task>
  ): Promise<Task[]> {
    // TODO: content visibility and state?
    const conditions: FilterQuery<Task>[] = filter.conditions ? [...filter.conditions] : [];
    conditions.push(this.getTidQueryFilter(context, filter.tIds));

    return this.findAllByFilter(
      context.profile,
      {
        ...filter,
        conditions,
      },
      options
    );
  }

  /**
   * Returns a filter query object based on the given context and tids.
   *
   * @param {ProfileContext} context - The context object containing profile and user information.
   * @param {string[]} tids - An array of tids (task IDs) to filter by.
   * @returns {FilterQuery<Task>} - A filter query object to be used in a database query.
   * @private
   */
  private getTidQueryFilter(context: ProfileContext, tids: string[]): FilterQuery<Task> {
    const { profile, user } = context;

    if (!profile.isOfType(ProfileType.Group)) {
      // Just a small optimization for non group profiles
      return {
        $or: [{ 'state.doneBy': [] }, { 'state.doneBy': { $elemMatch: { tid: { $in: tids } } } }],
      };
    }

    const uid = assureObjectId(user, true);

    return {
      $or: [
        // Not done by any user
        { 'state.doneBy': [] },
        // Shared task done at within given tids
        {
          'config.userStrategy': UserAssignmentStrategy.Shared,
          'state.doneBy': { $elemMatch: { tid: { $in: tids } } },
        },
        // Per user task done by user within given tids
        {
          'config.userStrategy': UserAssignmentStrategy.PerUser,
          $or: [
            { 'state.doneBy': { $elemMatch: { uid, tid: { $in: tids } } } },
            { 'state.doneBy': { $not: { $elemMatch: { uid } } } },
          ],
        },
      ],
    };
  }

  /**
   * Updates the "doneBy" field of a task with the given user information.
   *
   * @param {Profile} profile The profile of the task.
   * @param {DocumentIdentity<Task>} taskId The unique identifier of the task.
   * @param {UserDone} doneBy The user information to add to the doneBy field.
   * @return {Promise<boolean>} A Promise that resolves to true if the update was successful, false otherwise.
   */
  async pushDoneBy(
    profile: Profile,
    taskId: DocumentIdentity<Task>,
    doneBy: UserDone
  ): Promise<boolean> {
    return this.updateOneByProfileAndId(profile, taskId, { $push: { 'state.doneBy': doneBy } });
  }

  /**
   * Updates the "doneBy" field of a task.
   *
   * @param {Profile} profile - The profile in which the task belongs.
   * @param {DocumentIdentity<Task>} taskId - The ID of the task to be updated.
   * @param {UserDone} doneBy - The user information of the user who completed the task.
   * @return {Promise<boolean>} - A promise that resolves to a boolean indicating whether the update was successful or not.
   */
  async updateDoneBy(
    profile: Profile,
    taskId: DocumentIdentity<Task>,
    doneBy: UserDone
  ): Promise<boolean> {
    const result = await this.updateOneByProfileAndFilter(
      profile,
      taskId,
      {
        $set: { 'state.doneBy.$[elem].tid': doneBy.tid, 'state.doneBy.$[elem].date': doneBy.date },
      },
      {},
      {
        arrayFilters: [{ 'elem.uid': doneBy.uid }],
      }
    );

    if (result && taskId instanceof Task) {
      findAndReplace(taskId.state.doneBy, doneBy, 'uid', true);
    }

    return result;
  }

  async pullDoneBy(
    profile: Profile,
    taskId: DocumentIdentity<Task>,
    user: DocumentIdentity<User>
  ): Promise<boolean> {
    const uid = assureObjectId(user);
    const result = await this.updateOneByProfileAndId(profile, taskId, {
      $pull: { 'state.doneBy': { uid } },
    });

    // Automatic $pull is currently not supported by abstract dao
    if (result && taskId instanceof Task) {
      taskId.state.doneBy = taskId.state.doneBy.filter((d) => !d.uid.equals(uid));
    }

    return result;
  }

  async updateUserTimer(
    profile: Profile,
    identity: DocumentIdentity<Task>,
    user: DocumentIdentity<User>,
    timer: Timer
  ): Promise<boolean> {
    return this.updateOneByProfileAndFilter(
      profile,
      identity,
      { $set: { 'state.timers.$[elem].spans': timer.spans } },
      {},
      {
        arrayFilters: [{ 'elem.uid': assureObjectId(user) }],
      }
    );
  }
}

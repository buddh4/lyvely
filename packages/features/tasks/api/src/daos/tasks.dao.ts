import { Injectable } from '@nestjs/common';
import { Task, UserDone } from '../schemas';
import {
  assureObjectId,
  DocumentIdentity,
  IFetchQueryOptions,
  Model,
  OptionalUser,
  User,
  Profile,
  ProfileType,
  ContentTypeDao,
  UserAssignmentStrategy,
} from '@lyvely/api';
import { InjectModel } from '@nestjs/mongoose';
import { Timer } from '@lyvely/timers';
import { CalendarInterval } from '@lyvely/dates';
import { ICalendarPlanDao } from '@lyvely/calendar-plan';
import { findAndReplace } from '@lyvely/common';

@Injectable()
export class TasksDao extends ContentTypeDao<Task> implements ICalendarPlanDao<any> {
  @InjectModel(Task.name)
  protected model: Model<Task>;

  async findByProfileAndInterval(
    profile: Profile,
    plan: CalendarInterval,
    options: IFetchQueryOptions<Task> = {},
  ): Promise<Task[]> {
    return this.findAllByProfile(profile, { 'config.interval': plan }, options);
  }

  async findByProfileAndTimingIds(
    profile: Profile,
    user: OptionalUser,
    tIds: string[],
    options?: IFetchQueryOptions<Task>,
  ): Promise<Task[]> {
    // TODO: content visibility and state?

    if (!profile.isOfType(ProfileType.Group)) {
      // Just a small optimization for non group profiles
      return this.findAllByProfile(
        profile,
        {
          $or: [{ 'state.doneBy': [] }, { 'state.doneBy': { $elemMatch: { tid: { $in: tIds } } } }],
        },
        options,
      );
    }

    const uid = assureObjectId(user, true);

    return this.findAllByProfile(
      profile,
      {
        $or: [
          // Not done by any user
          { 'state.doneBy': [] },
          // Shared task done at within given tids
          {
            'config.userStrategy': UserAssignmentStrategy.Shared,
            'state.doneBy': { $elemMatch: { tid: { $in: tIds } } },
          },
          // Per user task done by user within given tids
          {
            'config.userStrategy': UserAssignmentStrategy.PerUser,
            $or: [
              { 'state.doneBy': { $elemMatch: { uid: uid, tid: { $in: tIds } } } },
              { 'state.doneBy': { $not: { $elemMatch: { uid: uid } } } },
            ],
          },
        ],
      },
      options,
    );
  }

  async pushDoneBy(
    profile: Profile,
    taskId: DocumentIdentity<Task>,
    doneBy: UserDone,
  ): Promise<boolean> {
    return this.updateOneByProfileAndId(profile, taskId, { $push: { 'state.doneBy': doneBy } });
  }

  async updateDoneBy(
    profile: Profile,
    taskId: DocumentIdentity<Task>,
    doneBy: UserDone,
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
      },
    );

    if (result && taskId instanceof Task) {
      findAndReplace(taskId.state.doneBy, doneBy, 'uid', true);
    }

    return result;
  }

  async pullDoneBy(
    profile: Profile,
    taskId: DocumentIdentity<Task>,
    user: DocumentIdentity<User>,
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
    timer: Timer,
  ): Promise<boolean> {
    return this.updateOneByProfileAndFilter(
      profile,
      identity,
      { $set: { 'state.timers.$[elem].spans': timer.spans } },
      {},
      {
        arrayFilters: [{ 'elem.uid': assureObjectId(user) }],
      },
    );
  }

  getModelConstructor() {
    return Task;
  }

  getModuleId(): string {
    return 'tasks';
  }
}

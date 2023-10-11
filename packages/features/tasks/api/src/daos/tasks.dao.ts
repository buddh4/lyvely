import { Injectable } from '@nestjs/common';
import { Task, UserDone } from '../schemas';
import { assureObjectId, EntityIdentity, IFetchQueryOptions } from '@lyvely/core';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OptionalUser, User } from '@lyvely/core';
import { Profile, ProfileType } from '@lyvely/core';
import { Timer } from '@lyvely/timers';
import { UserAssignmentStrategy } from '@lyvely/common';
import { CalendarInterval } from '@lyvely/dates';
import { ContentTypeDao } from '@lyvely/core';
import { ICalendarPlanDao } from '@lyvely/calendar-plan';

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
          $or: [{ doneBy: [] }, { doneBy: { $elemMatch: { tid: { $in: tIds } } } }],
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
          { doneBy: [] },
          // Shared task done at within given tids
          {
            'config.userStrategy': UserAssignmentStrategy.Shared,
            doneBy: { $elemMatch: { tid: { $in: tIds } } },
          },
          // Per user task done by user within given tids
          {
            'config.userStrategy': UserAssignmentStrategy.PerUser,
            $or: [
              { doneBy: { $elemMatch: { uid: uid, tid: { $in: tIds } } } },
              { doneBy: { $not: { $elemMatch: { uid: uid } } } },
            ],
          },
        ],
      },
      options,
    );
  }

  async updateDoneBy(
    profile: Profile,
    id: EntityIdentity<Task>,
    user: EntityIdentity<User>,
    doneBy: UserDone,
  ) {
    return this.updateOneByProfileAndFilter(
      profile,
      id,
      { $set: { 'doneBy.$[elem].tid': doneBy.tid, 'doneBy.$[elem].date': doneBy.date } },
      {},
      {
        arrayFilters: [{ 'elem.uid': assureObjectId(user) }],
      },
    );
  }

  async pullDoneBy(profile: Profile, id: EntityIdentity<Task>, user: EntityIdentity<User>) {
    return this.updateOneByProfileAndId(profile, id, {
      $pull: { doneBy: { uid: assureObjectId(user) } },
    });
  }

  async updateUserTimer(
    profile: Profile,
    identity: EntityIdentity<Task>,
    user: EntityIdentity<User>,
    timer: Timer,
  ) {
    return this.updateOneByProfileAndFilter(
      profile,
      identity,
      { $set: { 'timers.$[elem].spans': timer.spans } },
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

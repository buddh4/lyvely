import { Injectable } from '@nestjs/common';
import { Task, UserDone } from '../schemas';
import { assureObjectId, EntityIdentity, IFetchQueryOptions } from '@/core';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '@/users';
import { Profile } from '@/profiles';
import { Timer } from '@/calendar';
import { CalendarInterval, ProfileType, UserAssignmentStrategy } from '@lyvely/common';
import { AbstractContentDao } from '@/content';
import { CalendarPlanDao } from '@/calendar-plan';

@Injectable()
export class TasksDao extends AbstractContentDao<Task> implements CalendarPlanDao<any> {
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
    user: User,
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

    const uid = assureObjectId(user);

    return this.findAllByProfile(
      profile,
      {
        $or: [
          { doneBy: [] },
          // We ignore which user done the task on shared tasks
          {
            'config.userStrategy': UserAssignmentStrategy.Shared,
            doneBy: { $elemMatch: { tid: { $in: tIds } } },
          },
          // On per user tasks we only include tasks not done by the given user or done by the given user within the given tid
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

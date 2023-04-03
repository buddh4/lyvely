import { Injectable } from '@nestjs/common';
import { AbstractContentDao } from '@/content';
import { Task, TaskDocument, UserDone } from '../schemas';
import { assureObjectId, EntityIdentity } from '@/core';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import module from '../activities.meta';
import { User } from '@/users';
import { UserAssignmentStrategy } from '@lyvely/common';
import { Profile } from '@/profiles';
import { Timer } from '@/calendar';

@Injectable()
export class TasksDao extends AbstractContentDao<Task> {
  constructor(@InjectModel(Task.name) protected model: Model<TaskDocument>) {
    super();
  }

  async getNextSortOrder(profile: Profile) {
    const maxSortOrderEntry = await this.findAllByProfile(profile, {}, { sort: { 'meta.sortOrder': -1 }, limit: 1 });
    return maxSortOrderEntry.length ? maxSortOrderEntry[0].meta.sortOrder + 1 : 0;
  }

  async updateDoneBy(profile: Profile, id: EntityIdentity<Task>, user: EntityIdentity<User>, doneBy: UserDone) {
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

  async updateUserTimer(profile: Profile, identity: EntityIdentity<Task>, user: EntityIdentity<User>, timer: Timer) {
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
    return module.id;
  }
}

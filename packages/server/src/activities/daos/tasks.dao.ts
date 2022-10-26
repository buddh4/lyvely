import { Injectable } from '@nestjs/common';
import { AbstractContentDao } from '@/content';
import { Task, TaskDocument } from '../schemas';
import { assureObjectId, EntityIdentity } from '@/core';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import module from '../activities.meta';
import { User } from '@/users';
import { UserAssignmentStrategy } from '@lyvely/common';
import { Profile } from '@/profiles';

@Injectable()
export class TasksDao extends AbstractContentDao<Task> {
  constructor(@InjectModel(Task.name) protected model: Model<TaskDocument>) {
    super();
  }

  async getNextSortOrder(profile: Profile) {
    const maxSortOrderEntry = await this.findAllByProfile(profile, {}, { sort: { 'meta.sortOrder': -1 }, limit: 1 });
    return maxSortOrderEntry.length ? maxSortOrderEntry[0].meta.sortOrder + 1 : 0;
  }

  async setDone(
    profile: Profile,
    id: EntityIdentity<Task>,
    user: EntityIdentity<User>,
    timingId: string,
  ): Promise<boolean> {
    const task = id instanceof Task ? id : await this.findById(id);

    if (!task) {
      return false;
    }

    const doneBy = { uid: assureObjectId(user), tid: timingId, date: new Date() };
    const isDoneByUser = task.isDoneByUser(user);

    let result;
    if (task.userStrategy === UserAssignmentStrategy.Shared) {
      result = await this.updateOneSetById(id, { doneBy: [doneBy] });
    } else {
      result = !isDoneByUser
        ? await this.updateOneByProfileAndId(profile, id, { $push: { doneBy: doneBy } })
        : await this.updateOneByProfileAndFilter(
            profile,
            id,
            { $set: { 'doneBy.$[elem].tid': doneBy.tid, 'doneBy.$[elem].date': doneBy.date } },
            {},
            {
              arrayFilters: [{ 'elem.uid': assureObjectId(user) }],
            },
          );
    }

    if (result) {
      task.setDoneBy(user, doneBy.tid, doneBy.date);
    }

    return !!result;
  }

  async setUndone(profile: Profile, id: EntityIdentity<Task>, user: EntityIdentity<User>): Promise<boolean> {
    const task = id instanceof Task ? id : await this.findById(id);

    if (!task) {
      return false;
    }

    const result =
      task.userStrategy === UserAssignmentStrategy.Shared
        ? await this.updateOneByProfileAndIdSet(profile, id, { doneBy: [] })
        : await this.updateOneByProfileAndId(profile, id, { $pull: { doneBy: { uid: assureObjectId(user) } } });

    if (result) {
      task.setUndoneBy(user);
    }

    return !!result;
  }

  getModelConstructor() {
    return Task;
  }

  getModuleId(): string {
    return module.id;
  }
}

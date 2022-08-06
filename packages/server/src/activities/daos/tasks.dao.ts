import { Injectable } from '@nestjs/common';
import { AbstractContentDao } from '../../content';
import { Task, TaskDocument } from '../schemas';
import { assureObjectId, EntityIdentity } from '../../db/db.utils';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import module from "../activities.meta";
import { User } from "../../users";
import { UserAssignmentStrategy } from "@lyvely/common";

@Injectable()
export class TasksDao extends AbstractContentDao<Task> {
  constructor(@InjectModel(Task.name) protected model: Model<TaskDocument>) {
    super();
  }

  async setDone(id: EntityIdentity<Task>, user: EntityIdentity<User>, timingId: string): Promise<boolean> {
    // TODO: do we need another logic for shared?
    const task = id instanceof Task ? id : await this.findById(id);

    if(!task) {
      return false;
    }

    const doneBy = { uid: assureObjectId(user), tid: timingId, date: new Date() };
    const isDoneByUser = task.isDoneByUser(user);

    let result;
    if(task.userStrategy === UserAssignmentStrategy.Shared) {
      result = await this.updateOneSetById(id, { doneBy: [doneBy] });
    } else {
      result = !isDoneByUser
        ? await this.updateOneById(id, { $push: { doneBy: doneBy } })
        : await this._updateOneByFilter(id, { $set: { "doneBy.$[elem].tid": doneBy.tid, "doneBy.$[elem].date": doneBy.date } }, {}, {
          arrayFilters: [{ 'elem.uid': assureObjectId(user) }]
        } );
    }

    if(result) {
      task.setDoneBy(user, doneBy.tid, doneBy.date);
    }

    return !!result;
  }

  async setUndone(id: EntityIdentity<Task>, user: EntityIdentity<User>): Promise<boolean> {
    const task = id instanceof Task ? id : await this.findById(id);

    if(!task) {
      return false;
    }

    const result = task.userStrategy === UserAssignmentStrategy.Shared
      ? await this.updateOneSetById(id, { doneBy: [] })
      : await this.updateOneById(id, { $pull: { doneBy: { uid: assureObjectId(user) } } })

    if(result) {
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

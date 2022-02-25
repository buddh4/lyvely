import { Injectable } from '@nestjs/common';
import { AbstractContentDao } from '../../content';
import { Task, TaskDocument } from '../schemas';
import { EntityIdentity } from '../../db/db.utils';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Constructor } from 'lyvely-common';
import { string } from 'joi';

@Injectable()
export class TasksDao extends AbstractContentDao<Task> {
  constructor(@InjectModel(Task.name) protected model: Model<TaskDocument>) {
    super();
  }

  async setDone(id: EntityIdentity<Task>, timingId: string) {
    return this.updateOneSet(id, { done: timingId });
  }

  async setUndone(id: EntityIdentity<Task>) {
    return this.updateOneSet(id, { done: null });
  }

  getModelConstructor(): Constructor<Task> {
    return Task;
  }

  getModuleId(): string {
    return 'activities';
  }
}
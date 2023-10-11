import { Injectable } from '@nestjs/common';
import { User } from '@lyvely/core';
import { Profile, ProfileTestDataUtils } from '@lyvely/core';
import { CreateTaskModel } from '@lyvely/tasks-interface';
import { CalendarInterval, toTimingId } from '@lyvely/dates';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { assureObjectId, EntityIdentity, createBaseEntityInstance } from '@lyvely/core';
import { Task } from '../schemas';

@Injectable()
export class TaskTestDataUtil extends ProfileTestDataUtils {
  @InjectModel(Task.name)
  protected TaskModel: Model<Task>;

  static getDateToday(): Date {
    return new Date();
  }

  static getDateTomorrow(): Date {
    return new Date(new Date().setDate(new Date().getDate() + 1));
  }

  static getDateYesterday(): Date {
    return new Date(new Date().setDate(new Date().getDate() - 1));
  }

  static getTodayTimingId() {
    return toTimingId(TaskTestDataUtil.getDateToday());
  }

  static getTomorrowTimingId() {
    return toTimingId(TaskTestDataUtil.getDateTomorrow());
  }

  static getYesterdayTimingId() {
    return toTimingId(TaskTestDataUtil.getDateYesterday());
  }

  async findTaskById(id: EntityIdentity<Task>): Promise<Task | null> {
    const raw = await this.TaskModel.findById(assureObjectId(id)).lean();
    if (!raw) return null;
    return createBaseEntityInstance(Task, raw);
  }

  async createTask(
    user: User,
    profile: Profile,
    data?: Partial<CreateTaskModel>,
    overwrite?: (model: Task) => void,
  ): Promise<Task> {
    const initData = <CreateTaskModel>(
      Object.assign({}, { title: 'test', interval: CalendarInterval.Daily }, data || {})
    );

    const model = Task.create(profile, user, initData);
    if (overwrite) overwrite(model);
    const task = new this.TaskModel(model);

    Object.assign(task, overwrite);

    await task.save();

    return createBaseEntityInstance(Task, task.toObject());
  }
}

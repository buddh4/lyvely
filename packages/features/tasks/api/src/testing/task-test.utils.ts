import { Injectable } from '@nestjs/common';
import {
  ProfileTestDataUtils,
  Model,
  assureObjectId,
  DocumentIdentity,
  createBaseDocumentInstance,
  ProtectedProfileContext,
} from '@lyvely/api';
import { CreateTaskModel } from '@lyvely/tasks-interface';
import { CalendarInterval, toTimingId } from '@lyvely/dates';
import { InjectModel } from '@nestjs/mongoose';
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

  async findTaskById(id: DocumentIdentity<Task>): Promise<Task | null> {
    const raw = await this.TaskModel.findById(assureObjectId(id)).lean();
    if (!raw) return null;
    return createBaseDocumentInstance(Task, raw);
  }

  async createTask(
    context: ProtectedProfileContext,
    data?: Partial<CreateTaskModel>,
    overwrite?: (model: Task) => void
  ): Promise<Task> {
    const initData = <CreateTaskModel>(
      Object.assign({}, { title: 'test', interval: CalendarInterval.Daily }, data || {})
    );

    const model = Task.create(context, initData);
    if (overwrite) overwrite(model);
    const task = new this.TaskModel(model);

    Object.assign(task, overwrite);

    await task.save();

    return createBaseDocumentInstance(Task, task.toObject());
  }
}

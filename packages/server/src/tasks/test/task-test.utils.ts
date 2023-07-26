import { Injectable, Provider } from '@nestjs/common';
import { User } from '@/users';
import { Profile } from '@/profiles';
import { toTimingId, CalendarInterval, CreateTaskModel } from '@lyvely/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { getContentModelDefinition, getContentScoreDefinition } from '@/content';
import { TestingModuleBuilder } from '@nestjs/testing/testing-module.builder';
import { ModelDefinition } from '@nestjs/mongoose/dist/interfaces';
import { Type } from '@nestjs/common/interfaces/type.interface';
import { DynamicModule } from '@nestjs/common/interfaces/modules/dynamic-module.interface';
import { ForwardReference } from '@nestjs/common/interfaces/modules/forward-reference.interface';
import { createContentTestingModule, TestDataUtils } from '@/test';
import { assureObjectId, EntityIdentity, createBaseEntityInstance } from '@lyvely/core';
import { Task, TaskSchema, TaskScore, TaskScoreSchema } from '../schemas';

@Injectable()
export class TaskTestDataUtil extends TestDataUtils {
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

  async findTaskById(id: EntityIdentity<Task>): Promise<Task> {
    return createBaseEntityInstance(Task, await this.TaskModel.findById(assureObjectId(id)).lean());
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

export function createTaskTestingModule(
  key: string,
  providers: Provider[] = [],
  models: ModelDefinition[] = [],
  modules: Array<Type | DynamicModule | Promise<DynamicModule> | ForwardReference> = [],
): TestingModuleBuilder {
  providers.push(TaskTestDataUtil);
  models.push(
    getContentModelDefinition([{ name: Task.name, schema: TaskSchema }]),
    getContentScoreDefinition([{ name: TaskScore.name, schema: TaskScoreSchema }]),
  );
  return createContentTestingModule(key, providers, models, modules);
}

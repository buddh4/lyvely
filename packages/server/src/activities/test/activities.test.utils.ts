import { Injectable, Provider } from '@nestjs/common';
import { User } from '../../users';
import { Profile, ProfileScore } from '../../profiles';
import {
  Activity,
  ActivitySchema,
  Habit,
  HabitDocument,
  HabitSchema,
  Task,
  TaskDocument,
  TaskSchema,
} from '../schemas';
import {
  toTimingId,
  CalendarDate,
  CalendarIntervalEnum,
  CreateHabitModel,
  CreateTaskModel,
  toDate,
} from '@lyvely/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Content, ContentScore, ContentScoreSchema } from '@/content';
import { TestingModuleBuilder } from '@nestjs/testing/testing-module.builder';
import { ModelDefinition } from '@nestjs/mongoose/dist/interfaces';
import { Type } from '@nestjs/common/interfaces/type.interface';
import { DynamicModule } from '@nestjs/common/interfaces/modules/dynamic-module.interface';
import { ForwardReference } from '@nestjs/common/interfaces/modules/forward-reference.interface';
import { createContentTestingModule, TestDataUtils } from '@/test';
import { assureObjectId, EntityIdentity, createBaseEntityInstance } from '@/core';
import { ActivityScore, ActivityScoreSchema } from '../schemas/activity-score.schema';
import { DataPoint, DataPointSchema, NumberDataPoint } from '@/time-series';

@Injectable()
export class ActivityTestDataUtil extends TestDataUtils {
  @InjectModel(Habit.name)
  protected HabitModel: Model<HabitDocument>;

  @InjectModel(Task.name)
  protected TaskModel: Model<TaskDocument>;

  @InjectModel(DataPoint.name)
  protected HabitDataPointModel: Model<NumberDataPoint>;

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
    return toTimingId(ActivityTestDataUtil.getDateToday());
  }

  static getTomorrowTimingId() {
    return toTimingId(ActivityTestDataUtil.getDateTomorrow());
  }

  static getYesterdayTimingId() {
    return toTimingId(ActivityTestDataUtil.getDateYesterday());
  }

  async findTaskById(id: EntityIdentity<Task>): Promise<Task> {
    return createBaseEntityInstance(Task, await this.TaskModel.findById(assureObjectId(id)).lean());
  }

  async findHabitById(id: EntityIdentity<Habit>) {
    return createBaseEntityInstance(
      Habit,
      await this.HabitModel.findById(assureObjectId(id)).lean(),
    );
  }

  async createDataPoint(
    user: User,
    profile: Profile,
    activity: Activity,
    date: CalendarDate,
  ): Promise<NumberDataPoint> {
    const log = new this.HabitDataPointModel(
      new NumberDataPoint(profile, user, activity, { date: toDate(date) }),
    );
    await log.save();
    return createBaseEntityInstance(NumberDataPoint, log.toObject());
  }

  async createTask(
    user: User,
    profile: Profile,
    data?: Partial<CreateTaskModel>,
    overwrite?: (model: Task) => void,
  ): Promise<Task> {
    const initData = <CreateTaskModel>(
      Object.assign({}, { title: 'test', interval: CalendarIntervalEnum.Daily }, data || {})
    );

    const model = Task.create(profile, user, initData);
    if (overwrite) overwrite(model);
    const task = new this.TaskModel(model);

    Object.assign(task, overwrite);

    await task.save();

    return createBaseEntityInstance(Task, task.toObject());
  }

  async createHabit(
    user: User,
    profile: Profile,
    data?: Partial<CreateHabitModel>,
    overwrite?: (habit: Habit) => void,
  ): Promise<Habit> {
    const initData = <CreateHabitModel>(
      Object.assign({}, { title: 'test', interval: CalendarIntervalEnum.Daily }, data || {})
    );
    const model = Habit.create(profile, user, initData);
    if (overwrite) overwrite(model);
    const habit = new this.HabitModel(model);
    Object.assign(habit, overwrite);
    await habit.save();
    return createBaseEntityInstance(Habit, habit.toObject());
  }

  async delete() {
    await this.HabitDataPointModel.deleteMany({});
  }
}

export function createActivityTestingModule(
  key: string,
  providers: Provider[] = [],
  models: ModelDefinition[] = [],
  modules: Array<Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference> = [],
): TestingModuleBuilder {
  providers.push(ActivityTestDataUtil);
  models.push(
    {
      name: Activity.name,
      collection: Content.collectionName(),
      schema: ActivitySchema,
      discriminators: [
        { name: Habit.name, schema: HabitSchema },
        { name: Task.name, schema: TaskSchema },
      ],
    },
    { name: DataPoint.name, collection: 'habitdatapoints', schema: DataPointSchema },
    {
      name: ContentScore.name,
      collection: ProfileScore.collectionName(),
      schema: ContentScoreSchema,
      discriminators: [{ name: ActivityScore.name, schema: ActivityScoreSchema }],
    },
  );
  return createContentTestingModule(key, providers, models, modules);
}

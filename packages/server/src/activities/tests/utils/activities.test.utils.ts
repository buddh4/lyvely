import { Injectable, Provider } from '@nestjs/common';
import { User } from '../../../users';
import { Profile } from '../../../profiles';
import {
  Activity, ActivityDataPoint, ActivityDataPointDocument, ActivityDataPointSchema,
  ActivitySchema,
  Habit,
  HabitDocument,
  HabitSchema,
  Task,
  TaskDocument,
  TaskSchema
} from '../../schemas';
import {
  toTimingId,
  CalendarDate,
  CalendarIntervalEnum,
  CreateHabitDto, CreateTaskDto, IHabit, ITask, toDate
} from 'lyvely-common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Content } from '../../../content';
import { TestingModuleBuilder } from '@nestjs/testing/testing-module.builder';
import { ModelDefinition } from '@nestjs/mongoose/dist/interfaces';
import { Type } from '@nestjs/common/interfaces/type.interface';
import { DynamicModule } from '@nestjs/common/interfaces/modules/dynamic-module.interface';
import { ForwardReference } from '@nestjs/common/interfaces/modules/forward-reference.interface';
import { createTestingModule } from '../../../test/utils/test.utils';
import { TestDataUtils } from '../../../test/utils/test-data.utils';
import { assureObjectId, EntityIdentity } from '../../../db/db.utils';
import { DataPointMeta } from "../../../time-series";

@Injectable()
export class ActivityTestDataUtil extends TestDataUtils {

  @InjectModel(Habit.name)
  protected HabitModel: Model<HabitDocument>;

  @InjectModel(Task.name)
  protected TaskModel: Model<TaskDocument>;

  @InjectModel(ActivityDataPoint.name)
  protected ActivityLogModel: Model<ActivityDataPointDocument>


  static getDateToday(): Date {
    return new Date();
  }

  static getDateTomorrow(): Date {
    return new Date(new Date().setDate(new Date().getDate() + 1))
  }

  static getDateYesterday(): Date {
    return new Date(new Date().setDate(new Date().getDate() + 1))
  }

  static getTodayTimingId() {
    return toTimingId(ActivityTestDataUtil.getDateToday(), CalendarIntervalEnum.Daily);
  }

  static getTomorrowTimingId() {
    return toTimingId(ActivityTestDataUtil.getDateTomorrow(), CalendarIntervalEnum.Daily);
  }

  static getYesterdayTimingId() {
    return toTimingId(ActivityTestDataUtil.getDateYesterday(), CalendarIntervalEnum.Daily);
  }

  async findTaskById(id: EntityIdentity<Task>) {
    return this.TaskModel.findById(assureObjectId(id)).lean();
  }

  async findHabitById(id: EntityIdentity<Task>) {
    return this.HabitModel.findById(assureObjectId(id)).lean();
  }

  async createLog(user: User, profile: Profile, activity: Activity, date: CalendarDate): Promise<ActivityDataPoint> {
    const log = new this.ActivityLogModel(new ActivityDataPoint({
      meta: DataPointMeta.create(user, profile, activity),
      date: toDate(date)
    }));
    await log.save();
    return new ActivityDataPoint(log.toObject());
  }

  async createTask(user: User, profile: Profile, data?: Partial<CreateTaskDto>, overwrite?: Partial<ITask>): Promise<Task> {
    const initData = <CreateTaskDto> Object.assign({}, { title: 'test', interval: CalendarIntervalEnum.Daily }, data || {});
    const task = new this.TaskModel(Task.create(user, profile, initData));

    Object.assign(task, overwrite);

    await task.save();

    return new Task(task.toObject());
  }

  async createHabit(user: User, profile: Profile, data?: Partial<CreateHabitDto>, overwrite?: Partial<IHabit>): Promise<Habit> {
    const initData = <CreateHabitDto> Object.assign({}, { title: 'test', interval: CalendarIntervalEnum.Daily }, data || {});
    const habit = new this.HabitModel(Habit.create(user, profile, initData));
    Object.assign(habit, overwrite);
    await habit.save();
    return new Habit(habit.toObject());
  }

  async delete() {
    await this.ActivityLogModel.deleteMany({});
  }
}

export function createActivityTestingModule(key: string, providers: Provider[] = [], models: ModelDefinition[] = [], modules: Array<Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference> = []): TestingModuleBuilder {
  providers.push(ActivityTestDataUtil);
  models.push({
      name: Activity.name,
      collection: Content.collectionName(),
      schema: ActivitySchema,
      discriminators: [
        { name: Habit.name, schema: HabitSchema },
        { name: Task.name, schema: TaskSchema },
      ],
    },
    { name: ActivityDataPoint.name, schema: ActivityDataPointSchema });
  return createTestingModule(key, providers, models, modules);
}

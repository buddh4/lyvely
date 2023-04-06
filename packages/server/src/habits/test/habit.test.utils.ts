import { Injectable, Provider } from '@nestjs/common';
import { User } from '@/users';
import { Profile, ProfileScore } from '@/profiles';
import { Habit, HabitDocument, HabitSchema, HabitScore, HabitScoreSchema } from '../schemas';
import {
  toTimingId,
  CalendarDate,
  CalendarInterval,
  CreateHabitModel,
  toDate,
} from '@lyvely/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Content,
  ContentScore,
  ContentScoreSchema,
  getContentModelDefinition,
  getContentScoreDefinition,
} from '@/content';
import { TestingModuleBuilder } from '@nestjs/testing/testing-module.builder';
import { ModelDefinition } from '@nestjs/mongoose/dist/interfaces';
import { Type } from '@nestjs/common/interfaces/type.interface';
import { DynamicModule } from '@nestjs/common/interfaces/modules/dynamic-module.interface';
import { ForwardReference } from '@nestjs/common/interfaces/modules/forward-reference.interface';
import { createContentTestingModule, TestDataUtils } from '@/test';
import { assureObjectId, EntityIdentity, createBaseEntityInstance } from '@/core';
import { DataPoint, DataPointSchema, NumberDataPoint } from '@/time-series';
import { Journal, JournalSchema } from '@/journals/schemas';

@Injectable()
export class HabitTestDataUtil extends TestDataUtils {
  @InjectModel(Habit.name)
  protected HabitModel: Model<HabitDocument>;

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
    return toTimingId(HabitTestDataUtil.getDateToday());
  }

  static getTomorrowTimingId() {
    return toTimingId(HabitTestDataUtil.getDateTomorrow());
  }

  static getYesterdayTimingId() {
    return toTimingId(HabitTestDataUtil.getDateYesterday());
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
    habit: Habit,
    date: CalendarDate,
  ): Promise<NumberDataPoint> {
    const log = new this.HabitDataPointModel(
      new NumberDataPoint(profile, user, habit, { date: toDate(date) }),
    );
    await log.save();
    return createBaseEntityInstance(NumberDataPoint, log.toObject());
  }

  async createHabit(
    user: User,
    profile: Profile,
    data?: Partial<CreateHabitModel>,
    overwrite?: (habit: Habit) => void,
  ): Promise<Habit> {
    const initData = <CreateHabitModel>(
      Object.assign({}, { title: 'test', interval: CalendarInterval.Daily }, data || {})
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

export function createHabitTestingModule(
  key: string,
  providers: Provider[] = [],
  models: ModelDefinition[] = [],
  modules: Array<Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference> = [],
): TestingModuleBuilder {
  providers.push(HabitTestDataUtil);
  models.push(
    getContentModelDefinition([{ name: Habit.name, schema: HabitSchema }]),
    { name: DataPoint.name, collection: 'habitdatapoints', schema: DataPointSchema },
    getContentScoreDefinition([{ name: HabitScore.name, schema: HabitScoreSchema }]),
  );
  return createContentTestingModule(key, providers, models, modules);
}

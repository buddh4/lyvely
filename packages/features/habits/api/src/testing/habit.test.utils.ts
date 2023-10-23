import { Injectable } from '@nestjs/common';
import {
  User,
  Profile,
  ProfileTestDataUtils,
  assureObjectId,
  EntityIdentity,
  createBaseEntityInstance,
  Model,
} from '@lyvely/core';
import { Habit } from '../schemas';
import { toTimingId, CalendarDate, CalendarInterval, toDate } from '@lyvely/dates';
import { CreateHabitModel } from '@lyvely/habits-interface';
import {
  DataPointValueType,
  DataPointInputType,
  DataPoint,
  NumberDataPoint,
  InjectDataPointModel,
} from '@lyvely/time-series';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class HabitTestDataUtil extends ProfileTestDataUtils {
  @InjectModel(Habit.name)
  protected HabitModel: Model<Habit>;

  @InjectDataPointModel(Habit.name)
  protected HabitDataPointModel: Model<DataPoint>;

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
    const model = await this.HabitModel.findById(assureObjectId(id)).lean();

    if (!model) return null;

    return createBaseEntityInstance(Habit, model);
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
    const initData = <CreateHabitModel>Object.assign(
      {},
      {
        title: 'test',
        interval: CalendarInterval.Daily,
        valueType: DataPointValueType.Number,
        inputType: DataPointInputType.Checkbox,
      },
      data || {},
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

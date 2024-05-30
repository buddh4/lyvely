import { Injectable } from '@nestjs/common';
import { DocumentIdentity, IntegrityException, Model, Profile, User } from '@lyvely/api';
import { Habit } from '../schemas';
import { CalendarInterval, getWeekOfYear } from '@lyvely/dates';
import { DataPoint, DataPointValueType, InjectDataPointModel } from '@lyvely/time-series';
import type { PipelineStage } from 'mongoose';

export enum StatisticAccumulation {
  Sum = 'sum',
  Avg = 'avg',
  // Median = 'median',
}

export interface IHabitValueAggregateOptions {
  uid?: DocumentIdentity<User>;
  interval?: CalendarInterval;
  accumulation: StatisticAccumulation;
  year?: number;
  week?: number;
}

@Injectable()
export class HabitStatisticsService {
  @InjectDataPointModel(Habit.name)
  protected model: Model<DataPoint>;

  async aggregateHabitValues(
    profile: Profile,
    habit: Habit,
    options: IHabitValueAggregateOptions
  ): Promise<Array<{ _id: number; value: number }>> {
    if (habit.timeSeriesConfig.valueType !== DataPointValueType.Number)
      throw new IntegrityException('Can not aggregate non number habit values.');

    if (options.interval && options.interval > habit.interval)
      throw new IntegrityException(
        'Can not aggregate habit values due to invalid aggregation interval.'
      );

    const { matchFilter, groupId } = this.getGroupIdAndMatchFilter(profile, habit, options);
    const group = this.getAggregationGroup(groupId, options.accumulation);

    return this.model
      .aggregate([
        {
          $match: {
            oid: habit.oid,
            pid: habit.pid,
            cid: habit._id,
            ...matchFilter,
          },
        },
      ])
      .group(group)
      .sort({ _id: 1 })
      .exec();
  }

  private getGroupIdAndMatchFilter(
    profile: Profile,
    habit: Habit,
    options: IHabitValueAggregateOptions
  ) {
    const now = new Date();
    const year = options.year || now.getFullYear();
    const week = options.week || getWeekOfYear(now, profile.locale, profile.settings?.calendar);
    const interval = options.interval || habit.interval;

    let groupId: string;
    let matchFilter: any = {};

    switch (interval) {
      case CalendarInterval.Yearly:
        groupId = '$year';
        matchFilter = {
          year: { $in: Array.from({ length: 6 }, (_, index) => year - index) },
        };
        break;
      case CalendarInterval.Quarterly:
        groupId = '$year';
        matchFilter = { year };
        break;
      case CalendarInterval.Monthly:
        groupId = '$month';
        matchFilter = { year };
        break;
      case CalendarInterval.Weekly:
        groupId = '$week';
        matchFilter = {
          week: {
            $in: Array.from({ length: Math.min(week - 1, 6) }, (_, index) => week - index),
          },
        };
        break;
      case CalendarInterval.Daily:
        groupId = '$day';
        matchFilter = {
          week: {
            $in: Array.from({ length: Math.min(week - 1, 2) }, (_, index) => week - index),
          },
        };
        break;
      default:
        groupId = '$month';
        matchFilter = { year };
    }

    return { groupId, matchFilter };
  }

  private getAggregationGroup(groupId: string, accumulator: StatisticAccumulation) {
    let group: PipelineStage.Group['$group'];

    switch (accumulator) {
      case StatisticAccumulation.Sum:
        group = {
          _id: groupId,
          value: { $sum: '$value' },
        };
        break;
      case StatisticAccumulation.Avg:
        group = {
          _id: groupId,
          value: { $avg: '$value' },
        };
        break;
    }
    return group;
  }
}

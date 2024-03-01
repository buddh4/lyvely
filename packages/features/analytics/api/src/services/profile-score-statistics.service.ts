import { Injectable } from '@nestjs/common';
import { DocumentIdentity, Model, Profile, ProfileScore, User, assureObjectId } from '@lyvely/api';
import { CalendarInterval, getWeekOfYear } from '@lyvely/dates';
import * as mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

export enum StatisticAccumulation {
  Sum = 'sum',
  Avg = 'avg',
  // Median = 'median',
}

export interface IGraphValueAggregateOptions {
  uid?: DocumentIdentity<User>;
  interval?: CalendarInterval;
  accumulation: StatisticAccumulation;
  year?: number;
  week?: number;
}

@Injectable()
export class ProfileScoreStatisticsService {
  @InjectModel(ProfileScore.name)
  protected model: Model<ProfileScore>;

  async aggregateScoreValues(
    profile: Profile,
    options: IGraphValueAggregateOptions,
  ): Promise<Array<{ _id: number; value: number }>> {
    const { matchFilter, groupId } = this.getGroupIdAndMatchFilter(profile, options);
    const group = this.getAggregationGroup(groupId, options.accumulation);
    const $match = {
      oid: profile.oid,
      pid: profile.id,
      ...matchFilter,
    };

    if (options.uid) {
      $match['uid'] = assureObjectId(options.uid);
    }

    return this.model.aggregate([{ $match }]).group(group).sort({ _id: 1 }).exec();
  }

  private getGroupIdAndMatchFilter(profile: Profile, options: IGraphValueAggregateOptions) {
    const now = new Date();
    const year = options.year || now.getFullYear();
    const week = options.week || getWeekOfYear(now, profile.locale, profile.settings?.calendar);

    let groupId: string;
    let matchFilter: any = {};

    switch (options.interval) {
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
    let group: mongoose.PipelineStage.Group['$group'];

    switch (accumulator) {
      case StatisticAccumulation.Sum:
        group = {
          _id: groupId,
          value: { $sum: '$score' },
        };
        break;
      case StatisticAccumulation.Avg:
        group = {
          _id: groupId,
          value: { $avg: '$score' },
        };
        break;
    }
    return group;
  }
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { HabitDataPoint, HabitDataPointDocument } from '../activities/schemas';
import { Model } from 'mongoose';
import { ScoreStatistics , CalendarIntervalEnum } from 'lyvely-common';

import { User } from '../users/schemas/users.schema';

@Injectable()
export class StatisticsService {
  @InjectModel(HabitDataPoint.name)
  protected ActivityLogModel: Model<HabitDataPointDocument>;

  /*async getMonthlyScoreStatistics(
    user: User,
    year: number,
  ): Promise<ScoreStatistics> {
    const data = await this.ActivityLogModel.aggregate([
      { $match: { user: user._id, timing: { $exists: true }, 'timing.year': 2021 } },
    ])
      .unwind('$timing')
      .group({
        _id: '$timing.monthOfYear',
        score: { $sum: '$value' },
      })
      .exec();

    return new ScoreStatistics({
      title: `Monthly scores of ${year}`,
      plan: CalendarIntervalEnum.Monthly,
      data: data,
    });
  }

  async getMonthlyCategoryScoreStatistics(
    user: User,
    year: number,
    categories: string[],
  ): Promise<ScoreStatistics> {
    const data = await this.ActivityLogModel.aggregate([
      { $match: { user: user._id, timing: { $exists: true }, 'timing.year': 2021 } },
    ])
      .lookup({
        from: 'activities',
        localField: 'model',
        foreignField: '_id',
        as: 'activity_info',
      })
      .match({ 'activity_info.categories': { $in: categories } })
      .unwind('$timing')
      .group({
        _id: '$timing.monthOfYear',
        score: { $sum: '$value' },
      })
      .exec();

    return new ScoreStatistics({
      title: `Monthly scores of ${year}`,
      plan: CalendarIntervalEnum.Monthly,
      data: data,
    });
  }*/
}

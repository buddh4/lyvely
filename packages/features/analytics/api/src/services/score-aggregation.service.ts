import { Injectable } from '@nestjs/common';
import { assureObjectId, Model, Profile, ProfileScore } from '@lyvely/api';
import { CalendarInterval, getWeekOfYear } from '@lyvely/dates';
import * as mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { createIntervalAggregation } from '../aggregations/interval-aggregation.factory';
import { ChartSeriesAccumulation } from '@lyvely/analytics-interface';
import { ScoreChartSeriesConfig } from '../schemas';

@Injectable()
export class ScoreAggregationService {
  @InjectModel(ProfileScore.name)
  protected model: Model<ProfileScore>;

  async aggregateScoreValues(
    profile: Profile,
    interval: CalendarInterval,
    config: ScoreChartSeriesConfig,
  ): Promise<Array<{ _id: number; value: number }>> {
    const $match = {
      oid: profile.oid,
      pid: profile.id,
    };

    /*if (config.uid) {
      $match['uid'] = assureObjectId(options.uid);
    }*/

    const pipeline = createIntervalAggregation({
      interval,
      accumulator: ChartSeriesAccumulation.Sum,
      accumulationField: 'score',
      dateField: 'date',
      $match,
      locale: profile.locale,
      preferences: profile.settings?.calendar,
      endDate: new Date(),
    });

    return this.model.aggregate(pipeline).exec();
  }
}

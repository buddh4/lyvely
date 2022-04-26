import { Inject, Injectable } from '@nestjs/common';
import { Activity, ActivityDataPoint, ActivityDataPointDocument } from '../schemas';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DataPointService, TimeSeriesDataPointConstructor } from '../../time-series';
import { CalendarDate } from 'lyvely-common';
import { ProfilesService, Profile } from '../../profiles';
import { User } from '../../users/schemas/users.schema';
import { assureObjectId } from '../../db/db.utils';

@Injectable()
export class ActivityDataPointService extends DataPointService<Activity, ActivityDataPoint> {

  @Inject()
  protected profileService: ProfilesService;

  @InjectModel(ActivityDataPoint.name)
  protected LogModel: Model<ActivityDataPointDocument>;

  getLogModelConstructor(): TimeSeriesDataPointConstructor<Activity> {
    return ActivityDataPoint;
  }

  async updateLogValue(profile, log, model, update: number): Promise<ActivityDataPoint> {
    const oldValue = log.score;

    // TODO: use transaction
    // TODO: Move to dao
    const result = await this.LogModel.findOneAndUpdate(
      { _id: assureObjectId(log._id) },
      {
        $set: {
          value: Math.min(update, model.rating.max),
          score: ActivityDataPointService.calculateLogScore(model, update),
        },
      },
      { new: true },
    );

    await this.profileService.updateScore(profile, result.score - oldValue);

    return new ActivityDataPoint(result);
  }

  private static calculateLogScore(activity: Activity, units: number): number {
    return Math.min(units, activity.dataPointConfig.max) * activity.score;
  }

  async deleteLog(user: User, profile: Profile, timingModel: Activity, date: CalendarDate) {
    const log = await this.updateLog(user, profile, timingModel, date, 0);
    this.LogModel.deleteOne({ _id: log._id });
  }
}

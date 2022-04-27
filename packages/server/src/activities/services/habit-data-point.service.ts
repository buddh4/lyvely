import { Inject, Injectable } from '@nestjs/common';
import { Activity, Habit, HabitDataPoint } from '../schemas';
import { DataPointService, TimeSeriesDataPointConstructor } from '../../time-series';
import { CalendarDate } from 'lyvely-common';
import { Profile } from '../../profiles';
import { User } from '../../users';
import { HabitDataPointDao } from "../daos/habit-data-point.dao";
import { ActivityScoreAction } from "../schemas/activity-score-action.schema";
import { ActivityScoreActionService } from "./activity-score-action.service";

@Injectable()
export class HabitDataPointService extends DataPointService<Habit, HabitDataPoint, number> {

  @Inject()
  protected dataPointDao: HabitDataPointDao;

  @Inject()
  protected scoreService: ActivityScoreActionService;

  getDataPointConstructor(): TimeSeriesDataPointConstructor<Habit> {
    return HabitDataPoint;
  }

  protected async updateDataPointValue(profile, user, dataPoint: HabitDataPoint, activity: Habit, newValue: number): Promise<HabitDataPoint> {
    const oldValue = dataPoint.value || 0;
    newValue = Math.min(newValue, activity.dataPointConfig.max);

    await this.dataPointDao.updateOneSet(dataPoint, { value: newValue });
    dataPoint.value = newValue;

    const oldScore = HabitDataPointService.calculateLogScore(activity, oldValue);
    const newScore = HabitDataPointService.calculateLogScore(activity, newValue);

    await this.scoreService.saveProfileScoreAction(profile, new ActivityScoreAction({
      profile,
      activity,
      user,
      userStrategy: activity.userStrategy,
      score: newScore - oldScore,
      date: dataPoint.date
    }));

    return dataPoint;
  }

  private static calculateLogScore(activity: Activity, units: number): number {
    return Math.min(units, activity.dataPointConfig.max) * activity.score;
  }

  async deleteLog(user: User, profile: Profile, timingModel: Activity, date: CalendarDate) {
    const log = await this.updateOrCreateDataPoint(profile, user, timingModel, date, 0);
    await this.dataPointDao.deleteOne({ _id: log._id });
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { Activity, Habit, HabitDataPoint } from '../schemas';
import { NumberDataPointService } from '@/time-series';
import { CalendarDate, DataPointInputType } from '@lyvely/common';
import { Profile } from '@/profiles';
import { User } from '@/users';
import { HabitDataPointDao } from '../daos/habit-data-point.dao';
import { ActivityScore } from '../schemas/activity-score.schema';
import { ContentScoreService } from '@/content';

@Injectable()
export class HabitDataPointService extends NumberDataPointService<Habit, HabitDataPoint> {
  @Inject()
  protected dataPointDao: HabitDataPointDao;

  @Inject()
  protected scoreService: ContentScoreService;

  protected async updateDataPointValue(profile, user, dataPoint: HabitDataPoint, habit: Habit, newValue: number) {
    const oldValue = dataPoint.value || 0;

    await super.updateDataPointValue(profile, user, dataPoint, habit, newValue);

    const oldScore = HabitDataPointService.calculateLogScore(habit, oldValue);
    const newScore = HabitDataPointService.calculateLogScore(habit, newValue);

    await this.scoreService.saveScore(
      profile,
      new ActivityScore({
        profile,
        user,
        content: habit,
        userStrategy: habit.userStrategy,
        score: newScore - oldScore,
        date: dataPoint.date,
      }),
    );
  }

  private static calculateLogScore(activity: Activity, units: number): number {
    let result = 0;

    if (activity.dataPointConfig.inputType === DataPointInputType.Time) {
      if (activity.dataPointConfig.min && units >= activity.dataPointConfig.min) {
        result += activity.score;
      }

      if (
        activity.dataPointConfig.optimal &&
        activity.dataPointConfig.optimal !== activity.dataPointConfig.min &&
        units >= activity.dataPointConfig.optimal
      ) {
        result += activity.score;
      }

      if (
        activity.dataPointConfig.max &&
        activity.dataPointConfig.max !== activity.dataPointConfig.min &&
        activity.dataPointConfig.max !== activity.dataPointConfig.optimal &&
        units >= activity.dataPointConfig.max
      ) {
        result += activity.score;
      }
    } else {
      result = Math.min(units, activity.dataPointConfig.max) * activity.score;
    }

    return result;
  }

  async deleteLog(user: User, profile: Profile, timingModel: Activity, date: CalendarDate) {
    const log = await this.upsertDataPoint(profile, user, timingModel, date, 0);
    await this.dataPointDao.deleteOne({ _id: log._id });
  }
}

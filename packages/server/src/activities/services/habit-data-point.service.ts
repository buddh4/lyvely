import { Inject, Injectable } from '@nestjs/common';
import { Activity, Habit, HabitDataPoint } from '../schemas';
import { NumberDataPointService } from '@/time-series';
import { CalendarDate, DataPointInputType } from '@lyvely/common';
import { Profile } from '@/profiles';
import { User } from '@/users';
import { HabitDataPointDao } from '../daos/habit-data-point.dao';
import { ActivityScore } from '../schemas/activity-score.schema';
import { ContentScoreService } from '@/content';
import { isDefined } from 'class-validator';

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
        userStrategy: habit.timeSeriesConfig.userStrategy,
        score: newScore - oldScore,
        date: dataPoint.date,
      }),
    );
  }

  private static calculateLogScore(activity: Activity, units: number): number {
    let result = 0;

    if (activity.timeSeriesConfig.inputType === DataPointInputType.Time) {
      if (activity.timeSeriesConfig.min && units >= activity.timeSeriesConfig.min) {
        result += activity.config.score;
      }

      if (
        activity.timeSeriesConfig.optimal &&
        activity.timeSeriesConfig.optimal !== activity.timeSeriesConfig.min &&
        units >= activity.timeSeriesConfig.optimal
      ) {
        result += activity.config.score;
      }

      if (
        activity.timeSeriesConfig.max &&
        activity.timeSeriesConfig.max !== activity.timeSeriesConfig.min &&
        activity.timeSeriesConfig.max !== activity.timeSeriesConfig.optimal &&
        units >= activity.timeSeriesConfig.max
      ) {
        result += activity.config.score;
      }
    } else {
      const newValue = isDefined(activity.timeSeriesConfig.max)
        ? Math.min(units, activity.timeSeriesConfig.max)
        : units;
      result = newValue * activity.config.score;
    }

    return result;
  }

  async deleteLog(user: User, profile: Profile, timingModel: Activity, date: CalendarDate) {
    const log = await this.upsertDataPoint(profile, user, timingModel, date, 0);
    await this.dataPointDao.deleteOne({ _id: log._id });
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { Habit, HabitScore } from '../schemas';
import { DataPointUpdateResult, NumberDataPoint, NumberDataPointService } from '@/time-series';
import { DataPointInputType } from '@lyvely/common';
import { HabitDataPointDao } from '../daos';
import { ContentScoreService } from '@/content';
import { isDefined } from 'class-validator';
import { User } from '@/users';
import { Profile } from '@/profiles';

@Injectable()
export class HabitDataPointService extends NumberDataPointService<Habit> {
  @Inject()
  protected dataPointDao: HabitDataPointDao;

  @Inject()
  protected scoreService: ContentScoreService;

  protected async postProcess(
    profile: Profile,
    user: User,
    habit: Habit,
    updateResult: DataPointUpdateResult<NumberDataPoint>,
  ) {
    const { dataPoint } = updateResult;
    const oldScore = HabitDataPointService.calculateDataPointScore(
      habit,
      updateResult.oldValue || 0,
    );
    const newScore = HabitDataPointService.calculateDataPointScore(habit, dataPoint.value);

    await Promise.all([
      super.postProcess(profile, user, habit, updateResult),
      this.scoreService.saveScore(
        profile,
        new HabitScore({
          profile,
          user,
          content: habit,
          userStrategy: habit.timeSeriesConfig.userStrategy,
          score: newScore - oldScore,
          date: dataPoint.date,
        }),
      ),
    ]);
  }

  private static calculateDataPointScore(activity: Habit, units: number): number {
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
}

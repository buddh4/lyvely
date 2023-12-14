import { Inject, Injectable } from '@nestjs/common';
import { Habit, HabitScore } from '../schemas';
import {
  DataPointService,
  IDataPointUpdateResult,
  NumberDataPoint,
  DataPointValueType,
} from '@lyvely/time-series';
import { HabitDataPointDao } from '../daos';
import { ContentScoreService, ProtectedProfileContext } from '@lyvely/api';
import { isDefined } from 'class-validator';

@Injectable()
export class HabitDataPointService extends DataPointService<Habit> {
  @Inject()
  protected dataPointDao: HabitDataPointDao;

  @Inject()
  protected scoreService: ContentScoreService;

  protected override async postProcess(
    context: ProtectedProfileContext,
    habit: Habit,
    updateResult: IDataPointUpdateResult<NumberDataPoint>,
  ) {
    const { profile, user } = context;
    const { dataPoint } = updateResult;
    const oldScore = HabitDataPointService.calculateDataPointScore(
      habit,
      updateResult.oldValue || 0,
    );
    const newScore = HabitDataPointService.calculateDataPointScore(habit, dataPoint.value);

    await Promise.all([
      super.postProcess(context, habit, updateResult),
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

  private static calculateDataPointScore(habit: Habit, units: number): number {
    let result = 0;

    if (habit.timeSeriesConfig.valueType === DataPointValueType.Timer) {
      if (habit.timeSeriesConfig.min && units >= habit.timeSeriesConfig.min) {
        result += habit.config.score;
      }

      if (
        habit.timeSeriesConfig.optimal &&
        habit.timeSeriesConfig.optimal !== habit.timeSeriesConfig.min &&
        units >= habit.timeSeriesConfig.optimal
      ) {
        result += habit.config.score;
      }

      if (
        habit.timeSeriesConfig.max &&
        habit.timeSeriesConfig.max !== habit.timeSeriesConfig.min &&
        habit.timeSeriesConfig.max !== habit.timeSeriesConfig.optimal &&
        units >= habit.timeSeriesConfig.max
      ) {
        result += habit.config.score;
      }
    } else {
      const newValue = isDefined(habit.timeSeriesConfig.max)
        ? Math.min(units, habit.timeSeriesConfig.max!)
        : units;
      result = newValue * habit.config.score;
    }

    return result;
  }
}

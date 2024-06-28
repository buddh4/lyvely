import { Inject, Injectable } from '@nestjs/common';
import { Habit, type HabitDataPoint, HabitScore } from '../schemas';
import { DataPointService, IDataPointUpdateResult, TimerDataPointValue } from '@lyvely/time-series';
import { HabitDataPointDao } from '../daos';
import { ContentScoreService, ProtectedProfileContext } from '@lyvely/api';
import { CalendarDate, getFullDayTZDate } from '@lyvely/dates';
import { isNotNil } from '@lyvely/common';

@Injectable()
export class HabitDataPointService extends DataPointService<Habit, HabitDataPoint> {
  @Inject()
  protected dataPointDao: HabitDataPointDao;

  @Inject()
  protected scoreService: ContentScoreService;

  protected override async postProcess(
    context: ProtectedProfileContext,
    habit: Habit,
    updateResult: IDataPointUpdateResult<HabitDataPoint>,
    updateDate: CalendarDate
  ) {
    const { profile } = context;
    const { dataPoint } = updateResult;
    const oldScore = HabitDataPointService.calculateDataPointScore(
      habit,
      updateResult.oldValue || 0
    );
    const newScore = HabitDataPointService.calculateDataPointScore(habit, dataPoint.value);

    await Promise.all([
      super.postProcess(context, habit, updateResult, updateDate),
      this.scoreService.saveScore(
        context,
        new HabitScore({
          context,
          content: habit,
          userStrategy: habit.timeSeriesConfig.userStrategy,
          score: newScore - oldScore,
          // We translate the full day to profile timezone for aggregation purposes.
          date: getFullDayTZDate(updateDate, profile.timezone),
          tid: dataPoint.tid,
        })
      ),
    ]);
  }

  private static calculateDataPointScore(habit: Habit, value: HabitDataPoint['value']): number {
    if (typeof value === 'number') {
      const newValue = isNotNil(habit.timeSeriesConfig.max)
        ? Math.min(value, habit.timeSeriesConfig.max!)
        : value;
      return newValue * habit.config.score;
    }

    return this.calculateTimerDataPointScore(habit, value);
  }

  private static calculateTimerDataPointScore(habit: Habit, timer: TimerDataPointValue): number {
    const score = habit.config.score;
    const ms = timer.ms;
    let { min, max, optimal } = habit.timeSeriesConfig;

    min ??= 0;
    optimal ??= min;
    max ??= optimal;

    if (ms < min) return Math.floor(score * (ms / min));
    if (ms === min) return score;
    if (ms < optimal) return Math.floor(score * 2 * (ms / optimal));
    if (ms === optimal) return score * 2;
    if (ms < max) return Math.floor(score * 3 * (ms / max));
    if (ms >= max) return score * 3;

    return 0;
  }
}

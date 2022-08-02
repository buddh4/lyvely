import { Inject, Injectable } from '@nestjs/common';
import { Activity, Habit, HabitDataPoint } from '../schemas';
import { NumberDataPointService } from '../../time-series';
import { CalendarDate } from 'lyvely-common';
import { Profile } from '../../profiles';
import { User } from '../../users';
import { HabitDataPointDao } from "../daos/habit-data-point.dao";
import { ActivityScore } from "../schemas/activity-score.schema";
import { ContentScoreService } from "../../content";

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

    await this.scoreService.saveScore(profile, new ActivityScore({
      profile,
      user,
      content: habit,
      userStrategy: habit.userStrategy,
      score: newScore - oldScore,
      date: dataPoint.date
    }));
  }

  private static calculateLogScore(activity: Activity, units: number): number {
    return Math.min(units, activity.dataPointConfig.max) * activity.score;
  }

  async deleteLog(user: User, profile: Profile, timingModel: Activity, date: CalendarDate) {
    const log = await this.upsertDataPoint(profile, user, timingModel, date, 0);
    await this.dataPointDao.deleteOne({ _id: log._id });
  }
}

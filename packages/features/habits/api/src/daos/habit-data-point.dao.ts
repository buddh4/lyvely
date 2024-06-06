import { DataPointDao, InjectDataPointModel } from '@lyvely/time-series';
import { Injectable } from '@nestjs/common';
import { Habit, type HabitDataPoint } from '../schemas';
import { Model } from '@lyvely/api';

@Injectable()
export class HabitDataPointDao extends DataPointDao<HabitDataPoint> {
  @InjectDataPointModel(Habit.name)
  protected model: Model<HabitDataPoint>;

  protected contentName = Habit.name;

  getModuleId(): string {
    return 'habits';
  }
}

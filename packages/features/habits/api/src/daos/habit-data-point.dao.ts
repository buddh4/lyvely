import { DataPoint, DataPointDao, InjectDataPointModel } from '@lyvely/time-series';
import { Injectable } from '@nestjs/common';
import { Habit } from '../schemas';
import { Model } from '@lyvely/core';

@Injectable()
export class HabitDataPointDao extends DataPointDao {
  @InjectDataPointModel(Habit.name)
  protected model: Model<DataPoint>;

  protected contentName = Habit.name;

  getModuleId(): string {
    return 'habits';
  }
}

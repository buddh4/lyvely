import { DataPoint, DataPointDao } from '@/time-series';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectDataPointModel } from '@/time-series/decorators/inject-data-point-model.decorator';
import { Habit } from '../schemas';

@Injectable()
export class HabitDataPointDao extends DataPointDao {
  @InjectDataPointModel(Habit.name)
  protected model: Model<DataPoint>;

  protected contentName = Habit.name;

  getModuleId(): string {
    return 'habits';
  }
}

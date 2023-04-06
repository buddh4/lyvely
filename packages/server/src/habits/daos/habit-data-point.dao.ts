import { DataPoint, DataPointStrategyDao, NumberDataPoint } from '@/time-series';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectDataPointModel } from '@/time-series/decorators/inject-data-point-model.decorator';
import { Habit } from '../schemas';

@Injectable()
export class HabitDataPointDao extends DataPointStrategyDao {
  @InjectDataPointModel(Habit.name)
  protected model: Model<DataPoint>;

  getModuleId(): string {
    return 'habits';
  }

  getModelConstructor() {
    return NumberDataPoint;
  }
}

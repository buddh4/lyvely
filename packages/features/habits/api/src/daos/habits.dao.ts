import { Injectable } from '@nestjs/common';
import { Habit } from '../schemas';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from '@lyvely/api';
import { TimeSeriesContentDao } from '@lyvely/time-series';

@Injectable()
export class HabitsDao extends TimeSeriesContentDao<Habit> {
  constructor(@InjectModel(Habit.name) protected model: Model<Habit>) {
    super();
  }

  getModelConstructor() {
    return Habit;
  }

  getModuleId(): string {
    return 'habits';
  }
}

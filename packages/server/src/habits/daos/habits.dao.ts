import { Injectable } from '@nestjs/common';
import { HabitDocument, Habit } from '../schemas';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TimeSeriesContentDao } from '@/time-series';

@Injectable()
export class HabitsDao extends TimeSeriesContentDao<Habit> {
  constructor(@InjectModel(Habit.name) protected model: Model<HabitDocument>) {
    super();
  }

  getModelConstructor() {
    return Habit;
  }

  getModuleId(): string {
    return 'habits';
  }
}

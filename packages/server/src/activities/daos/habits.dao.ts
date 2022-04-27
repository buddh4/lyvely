import { Injectable } from '@nestjs/common';
import { AbstractContentDao } from '../../content';
import { HabitDocument, Habit } from '../schemas';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Constructor } from '@nestjs/common/utils/merge-with-values.util';
import module from "../activities.meta";

@Injectable()
export class HabitsDao extends AbstractContentDao<Habit> {
  constructor(@InjectModel(Habit.name) protected model: Model<HabitDocument>) {
    super();
  }

  getModelConstructor(): Constructor<Habit> {
    return Habit;
  }

  getModuleId(): string {
    return module.id;
  }
}

import { Injectable } from '@nestjs/common';
import { AbstractContentDao } from '../../content';
import { HabitDocument, Habit } from '../schemas';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import module from "../activities.meta";
import { Profile } from "../../profiles";

@Injectable()
export class HabitsDao extends AbstractContentDao<Habit> {
  constructor(@InjectModel(Habit.name) protected model: Model<HabitDocument>) {
    super();
  }

  async getNextSortOrder(profile: Profile) {
    const maxSortOrderEntry = await this.findAllByProfile(profile, {}, { sort: { sortOrder: -1 }, limit: 1 });
    return (!maxSortOrderEntry.length || typeof maxSortOrderEntry[0].sortOrder !== 'number')
      ? 0
      : maxSortOrderEntry[0].sortOrder + 1;
  }

  getModelConstructor() {
    return Habit;
  }

  getModuleId(): string {
    return module.id;
  }
}

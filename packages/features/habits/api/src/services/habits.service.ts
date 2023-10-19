import { Injectable, Inject, Logger } from '@nestjs/common';
import { Habit } from '../schemas';
import { ContentTypeService, Profile, User } from '@lyvely/core';
import { HabitsDao } from '../daos';
import { CreateHabitModel, UpdateHabitModel } from '@lyvely/habits-interface';

@Injectable()
export class HabitsService extends ContentTypeService<Habit, CreateHabitModel> {
  @Inject()
  protected contentDao: HabitsDao;

  protected logger = new Logger(HabitsService.name);

  protected async createInstance(profile: Profile, user: User, model: CreateHabitModel) {
    return Habit.create(profile, user, model);
  }

  protected async createUpdate(
    profile: Profile,
    user: User,
    content: Habit,
    model: UpdateHabitModel,
  ) {
    return content.applyUpdate(model);
  }
}

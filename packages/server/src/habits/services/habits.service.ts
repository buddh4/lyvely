import { Injectable, Inject, Logger } from '@nestjs/common';
import { Habit } from '../schemas';
import { AbstractContentTypeService } from '@/content';
import { HabitsDao } from '../daos/habits.dao';
import { Profile } from '@/profiles';
import { User } from '@/users';
import { CreateHabitModel, UpdateHabitModel } from '@lyvely/common';

@Injectable()
export class HabitsService extends AbstractContentTypeService<Habit, CreateHabitModel> {
  @Inject()
  protected contentDao: HabitsDao;

  protected logger = new Logger(HabitsService.name);

  protected async createInstance(profile: Profile, user: User, model: CreateHabitModel) {
    const instance = Habit.create(profile, user, model);
    instance.meta.sortOrder = await this.contentDao.getNextSortOrder(profile);

    return instance;
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
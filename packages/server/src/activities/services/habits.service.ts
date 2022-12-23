import { Injectable, Inject } from '@nestjs/common';
import { Habit } from '../schemas';
import { AbstractContentService } from '@/content';
import { HabitsDao } from '../daos/habits.dao';
import { Profile } from '@/profiles';
import { User } from '@/users';
import { CreateHabitDto } from '@lyvely/common';

@Injectable()
export class HabitsService extends AbstractContentService<Habit> {
  @Inject()
  protected contentDao: HabitsDao;

  async createHabit(profile: Profile, user: User, dto: CreateHabitDto) {
    return this.createContent(profile, user, Habit.create(profile, user, dto), dto.tagNames);
  }

  async createContent(
    profile: Profile,
    user: User,
    model: Habit,
    tagNames?: string[],
  ): Promise<Habit> {
    model.meta.sortOrder = await this.contentDao.getNextSortOrder(profile);
    return super.createContent(profile, user, model, tagNames);
  }
}

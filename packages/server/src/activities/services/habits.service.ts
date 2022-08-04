import { Injectable } from '@nestjs/common';
import { Habit } from '../schemas';
import { AbstractContentService } from '../../content';
import { HabitsDao } from '../daos/habits.dao';
import { Profile } from "../../profiles";
import { User } from "../../users";
import { ServiceException } from "../../core/exceptions";


@Injectable()
export class HabitsService extends AbstractContentService<Habit> {
  constructor(protected contentDao: HabitsDao) {
    super(contentDao);
  }

  async updateHabit(profile: Profile, user: User, oldHabit: Habit, update: Habit): Promise<Habit> {
    update.dataPointConfig.history = oldHabit.dataPointConfig.history;

    if (oldHabit.revisionCheck(update)) {
      update.pushRevision(oldHabit);
    }

    if(!await super.updateContent(profile, user, oldHabit, update)) {
      throw new ServiceException('Habit could not be updated');
    }

    return this.contentDao.reload(oldHabit);
  }
}

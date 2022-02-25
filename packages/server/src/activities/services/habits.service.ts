import { Injectable } from '@nestjs/common';
import { Habit } from '../schemas';
import { AbstractContentService } from '../../content/services/abstract-content.service';
import { HabitsDao } from '../daos/habits.dao';

@Injectable()
export class HabitsService extends AbstractContentService<Habit> {
  constructor(protected contentDao: HabitsDao) {
    super(contentDao);
  }
}

import { Injectable, Inject } from '@nestjs/common';
import { Milestone } from '../schemas';
import { Profile } from '@/profiles';
import { CalendarInterval, CalendarPlanFilter } from '@lyvely/common';
import { MilestonesDao } from '../daos';
import { SortableCalendarPlanService } from '@/calendar-plan';
import { User } from '@/users';
import { ContentCondition } from '@/content/schemas/content-query.builder';
import { MilestonesRelationsService } from '@/milestones/services/milestones-relations.service';
import { isDefined } from 'class-validator';
import { DBQuery } from '@/core';

@Injectable()
export class MilestonesCalendarPlanService extends SortableCalendarPlanService<Milestone> {
  @Inject()
  protected contentDao: MilestonesDao;

  @Inject()
  protected relationsService: MilestonesRelationsService;

  findByFilter(
    profile: Profile,
    user: User,
    filter: CalendarPlanFilter,
  ): Promise<Array<Milestone>> {
    const conditions = [];

    if (!isDefined(filter.cid) || isDefined(filter.archived)) {
      conditions.push(ContentCondition.archived(filter.archived));
    }

    if (isDefined(filter.cid)) {
      conditions.push(ContentCondition.cid(filter.cid));
    }

    return this.contentDao.findAllByProfile(profile, DBQuery.and(conditions));
  }

  async findMilestonesWithRelations(profile: Profile, user: User, filter: CalendarPlanFilter) {
    const models = await this.findByFilter(profile, user, filter);
    const relations = await this.relationsService.getRelationsByMilestones(
      profile,
      user,
      models,
      filter.date,
    );
    return { models, relations };
  }

  protected async updateIntervalConfig(
    profile: Profile,
    model: Milestone,
    interval: CalendarInterval,
  ): Promise<void> {
    await this.contentDao.updateOneByProfileAndIdSet(profile, model, {
      'config.interval': interval,
    });
    model.config.interval = interval;
  }
}

import { Injectable, Inject } from '@nestjs/common';
import { Milestone } from '../schemas';
import { Profile, User, ContentCondition, DBQuery, OptionalUser } from '@lyvely/core';
import { CalendarInterval } from '@lyvely/dates';
import { CalendarPlanFilter, SortableCalendarPlanService } from '@lyvely/calendar-plan';
import { MilestonesDao } from '../daos';
import { MilestonesRelationsService } from './milestones-relations.service';
import { isDefined } from 'class-validator';
import { FilterQuery } from 'mongoose';

@Injectable()
export class MilestonesCalendarPlanService extends SortableCalendarPlanService<Milestone> {
  @Inject()
  protected contentDao: MilestonesDao;

  @Inject()
  protected relationsService: MilestonesRelationsService;

  findByFilter(
    profile: Profile,
    user: OptionalUser,
    filter: CalendarPlanFilter,
  ): Promise<Array<Milestone>> {
    const conditions: FilterQuery<Milestone>[] = [];

    if (!isDefined(filter.cid) || isDefined(filter.archived)) {
      conditions.push(ContentCondition.archived(filter.archived!));
    }

    if (isDefined(filter.cid)) {
      conditions.push(ContentCondition.cid(filter.cid!));
    }

    return this.contentDao.findAllByProfile(profile, DBQuery.and(conditions));
  }

  async findMilestonesWithRelations(
    profile: Profile,
    user: OptionalUser,
    filter: CalendarPlanFilter,
  ) {
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

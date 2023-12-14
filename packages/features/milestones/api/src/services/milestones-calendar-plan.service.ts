import { Injectable, Inject } from '@nestjs/common';
import { Milestone } from '../schemas';
import { Profile, ContentCondition, DBQuery, FilterQuery, ProfileContext } from '@lyvely/api';
import { CalendarInterval } from '@lyvely/dates';
import { CalendarPlanFilter, SortableCalendarPlanService } from '@lyvely/calendar-plan';
import { MilestonesDao } from '../daos';
import { MilestonesRelationsService } from './milestones-relations.service';
import { isDefined } from 'class-validator';

/**
 * Service for managing milestones in a calendar plan.
 * Extends SortableCalendarPlanService.
 * @extends SortableCalendarPlanService<Milestone>
 */
@Injectable()
export class MilestonesCalendarPlanService extends SortableCalendarPlanService<Milestone> {
  /** Milestone content dao, responsible for data access. **/
  @Inject()
  protected contentDao: MilestonesDao;

  /** MilestonesRelationsService, responsible for fetching related content entries. **/
  @Inject()
  protected relationsService: MilestonesRelationsService;

  /**
   * Find milestones by filter.
   *
   * @param {ProfileContext} context - The profile context.
   * @param {CalendarPlanFilter} filter - The filter to apply.
   * @return {Promise<Array<Milestone>>} - A promise that resolves to an array of milestones that match the filter.
   */
  findByFilter(context: ProfileContext, filter: CalendarPlanFilter): Promise<Array<Milestone>> {
    const conditions: FilterQuery<Milestone>[] = [];

    if (!isDefined(filter.cid) || isDefined(filter.archived)) {
      conditions.push(ContentCondition.archived(filter.archived!));
    }

    if (isDefined(filter.cid)) {
      conditions.push(ContentCondition.cid(filter.cid!));
    }

    return this.contentDao.findAllByProfile(context.profile, DBQuery.and(conditions));
  }

  /**
   * Find milestones with their relations.
   *
   * @param {ProfileContext} context - The profile context.
   * @param {CalendarPlanFilter} filter - The filter to apply.
   * @return {Promise<{ models: Milestone[], relations: Relation[] }>} - The promise that resolves to an object containing the found milestones and their relations.
   */
  async findMilestonesWithRelations(context: ProfileContext, filter: CalendarPlanFilter) {
    const models = await this.findByFilter(context, filter);
    const relations = await this.relationsService.getRelationsByMilestones(
      context,
      models,
      filter.date,
    );
    return { models, relations };
  }

  /**
   * Updates the interval configuration for a given profile and milestone.
   *
   * @param {Profile} profile - The profile object representing the user.
   * @param {Milestone} model - The milestone object to be updated.
   * @param {CalendarInterval} interval - The new interval to be set.
   * @protected
   * @returns {Promise<void>} - A Promise that resolves after the update is completed.
   */
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

import { Injectable, Inject } from '@nestjs/common';
import { Milestone } from '../schemas';
import { Profile, ProfileContext } from '@lyvely/api';
import { CalendarInterval } from '@lyvely/dates';
import { CalendarPlanFilter, SortableCalendarPlanService } from '@lyvely/calendar-plan';
import { MilestonesDao } from '../daos';
import { MilestonesRelationsService } from './milestones-relations.service';
import { MilestoneRelationModel } from '@lyvely/milestones-interface';
import type { TObjectId } from '@lyvely/api';

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
   * Find milestones with relations.
   *
   * @param {ProfileContext} context - The profile context.
   * @param {CalendarPlanFilter} filter - The filter to apply.
   * @return {Promise<{ models: Milestone[], relations: MilestoneRelationModel<TObjectId>[] }>} - The promise that resolves to an object containing the found milestones and their relations.
   */
  async findMilestonesWithRelations(
    context: ProfileContext,
    filter: CalendarPlanFilter
  ): Promise<{ models: Milestone[]; relations: MilestoneRelationModel<TObjectId>[] }> {
    const models = await this.findByFilter(context, filter);
    const relations = await this.relationsService.getRelationsByMilestones(
      context,
      models,
      filter.date
    );
    return { models, relations };
  }
}

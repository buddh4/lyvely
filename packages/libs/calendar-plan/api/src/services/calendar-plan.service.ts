import { ProfileContext, ContentPolicyService } from '@lyvely/api';
import { CalendarPlanFilter } from '@lyvely/calendar-plan-interface';
import { ICalendarPlanDao, CalendarPlanEntity } from '../interfaces';
import { getTimingIds } from '@lyvely/dates';
import { Inject } from '@nestjs/common';

/**
 * Represents the base service class for CalendarPlan features.
 * The service is responsible for fetching CalendarPlanContent documents for a given filter.
 * @template TModel - The type of calendar plan entity.
 */
export abstract class CalendarPlanService<TModel extends CalendarPlanEntity> {
  /**
   * Defines the dao of the related CalendarPlanContent type used for updating and fetching instances.
   * @template TModel - The type of the model representing a calendar plan.
   */
  protected abstract contentDao: ICalendarPlanDao<TModel>;

  @Inject()
  protected contentPolicyService: ContentPolicyService;

  /**
   * Retrieves an array of models based on the specified filter.
   *
   * @param {ProfileContext} context - The context of the profile.
   * @param {CalendarPlanFilter} filter - The filter to be applied on the models.
   *
   * @return {Promise<Array<TModel>>} - A promise that resolves to an array of models*/
  async findByFilter(context: ProfileContext, filter: CalendarPlanFilter): Promise<Array<TModel>> {
    const { profile } = context;

    const models = await this.contentDao.findByTimingIds(context, {
      tIds: getTimingIds(filter.date, profile.locale, filter.level, profile.settings?.calendar),
      ...filter,
    });

    await this.contentPolicyService.populateContentPolicies(context, models);

    return models;
  }
}

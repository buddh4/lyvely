import { ProfileContext } from '@lyvely/api';
import { CalendarPlanFilter } from '@lyvely/calendar-plan-interface';
import { ICalendarPlanDao, CalendarPlanEntity } from '../interfaces';

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

  /**
   * Finds and returns an array of CalendarPlanContent documents matching the provided filter.
   *
   * @param {ProfileContext} context - The context in which the search is performed.
   * @param {CalendarPlanFilter} filter - The filter object specifying the criteria for the search.
   *
   * @return {Promise<Array<TModel>>} - A promise that resolves to an array of models matching the filter.
   */
  abstract findByFilter(
    context: ProfileContext,
    filter: CalendarPlanFilter,
  ): Promise<Array<TModel>>;
}

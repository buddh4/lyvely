import {
  CalendarPlanEntity,
  type ICalendarPlanDao,
  type ICalendarPlanIntervalSearchFilter,
  type ICalendarPlanSearchFilter,
  type ICalendarPlanTidSearchFilter,
} from '../interfaces';
import {
  ContentTypeDao,
  ProfileContext,
  ProtectedProfileContentContext,
  cloneQuery,
} from '@lyvely/api';
import type { FilterQuery, IFetchQueryOptions } from '@lyvely/api';
import { isNotNil } from '@lyvely/common';
import { CalendarInterval } from '@lyvely/dates';

/**
 * Base DAO (Data Abstract Object) class for content documents with calendar-plan support.
 *
 * @template TModel - The type of Calendar Plan entity.
 * @template TFilter - The type of search filter for Calendar Plan.
 * @template TVersions - The type of Calendar Plan versions.
 */
export abstract class CalendarPlanDao<
    TModel extends CalendarPlanEntity,
    TFilter extends ICalendarPlanSearchFilter = ICalendarPlanSearchFilter,
    TVersions extends TModel = TModel,
  >
  extends ContentTypeDao<TModel, TFilter, TVersions>
  implements ICalendarPlanDao<TModel, TFilter, TVersions>
{
  /**
   * The query path used for the interval filter e.g. `config.interval`
   *
   * @typedef {string} intervalPath
   */
  abstract intervalPath: string;

  /**
   * Finds documents by filter and interval.
   *
   * @param context
   * @param filter
   * @param options
   */
  async findByInterval(
    context: ProfileContext,
    filter: TFilter & ICalendarPlanIntervalSearchFilter,
    options?: IFetchQueryOptions<TModel>
  ): Promise<TModel[]> {
    return this.findAllByFilter(
      context.profile,
      {
        ...filter,
        interval: filter.interval,
      } as TFilter,
      options
    );
  }

  /**
   * Updates the interval of a protected profile content.
   *
   * @param {ProtectedProfileContentContext<TModel>} context - The context of the protected profile content.
   * @param {CalendarInterval} interval - The new interval for the protected profile content.
   * @return {Promise<boolean>} - Returns a promise that resolves to a boolean indicating if the update was successful or not.
   */
  async updateInterval(
    context: ProtectedProfileContentContext<TModel>,
    interval: CalendarInterval
  ): Promise<boolean> {
    const { content, profile } = context;
    return this.updateOneByProfileAndIdSet(profile, content, {
      [this.intervalPath]: interval,
    });
  }

  /**
   * Returns all time-series content models by given tid filter.
   * The default implementation just returns all entries related to the given profile, subclasses may implement more
   * sophisticated queries.
   *
   * @param context
   * @param filter
   * @param options
   */
  async findByTimingIds(
    context: ProfileContext,
    filter: TFilter & ICalendarPlanTidSearchFilter,
    options?: IFetchQueryOptions<TModel>
  ): Promise<TModel[]> {
    return this.findAllByFilter(context.profile, filter, options);
  }

  /**
   * Creates a filter query based on the given filter object.
   *
   * @param {TFilter} filter - The filter object.
   * @protected
   * @returns {FilterQuery<TModel> | undefined} The filter query or undefined if the filter is not provided.
   */
  protected override buildFilterQuery(filter?: TFilter): FilterQuery<TModel> | undefined {
    if (!filter) return;

    filter = cloneQuery(filter);
    filter.conditions ??= [];

    if (isNotNil(filter.interval)) {
      filter.conditions.push({
        [this.intervalPath]: filter.interval,
      });
    }

    return super.buildFilterQuery(filter);
  }
}

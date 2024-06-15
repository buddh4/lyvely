import { FilterQuery } from '../interfaces';
import { isNotNil } from '@lyvely/common';

/**
 * Represents a utility class for constructing MongoDB query conditions.
 *
 * @example
 *
 * const filterQuery = DBQuery.and([
 *   isNotNil(filter.cid) ? ContentCondition.cid(filter.cid!) : null,
 *   isNotNil(filter.archived) ? ContentCondition.archived(filter.archived!) : null,
 *   isNotNil(filter.roleLevel) ? ContentCondition.visibility(filter.roleLevel!) : null,
 * ]);
 *
 */
export class DBQuery {
  /**
   * Builds a simple or query which consists of an object of the form { $or: { conditions } }.
   * Null or undefined conditions will be ignored. If no non-empty conditions are given, this function
   * returns an empty object.
   * @param conditions
   */
  static or<T = any>(conditions: Array<FilterQuery<T> | undefined | null>): FilterQuery<T> {
    const filteredConditions = conditions.filter<FilterQuery<T>>(isNotNil);
    if (!filteredConditions?.length) return {};
    if (filteredConditions.length === 1) return filteredConditions[0];
    return { $or: Object.assign({}, ...filteredConditions) };
  }

  /**
   * Builds a simple and query which consists of an object containing the different conditions.
   * Null or undefined conditions will be ignored. If no non-empty conditions are given, this function
   * returns an empty object.
   * @param conditions
   */
  static and<T = any>(conditions: Array<FilterQuery<T> | undefined | null>): FilterQuery<T> {
    const filteredConditions = conditions.filter<FilterQuery<T>>(isNotNil);
    if (!filteredConditions?.length) return {};
    if (filteredConditions.length === 1) return filteredConditions[0];
    return Object.assign({}, ...filteredConditions);
  }
}

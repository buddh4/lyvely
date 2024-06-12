import { FilterQuery, assureObjectId, DocumentIdentity, DBQuery } from '@/core';
import { Content } from '../schemas/content.schema';
import { ProfileRoleLevel } from '@lyvely/interface';
import { IContentSearchFilter } from './content-search-filter.interface';
import { isNotNil } from '@lyvely/common';

export class ContentCondition {
  /**
   * Represents a filter query for retrieving archived content.
   *
   * @type {FilterQuery<Content>}
   * @constant
   */
  static ARCHIVED: FilterQuery<Content> = { 'meta.archived': true };

  /**
   * Represents a filter query for non-archived content.
   *
   * @type {FilterQuery<Content>}
   */
  static NOT_ARCHIVED: FilterQuery<Content> = { 'meta.archived': { $in: [null, false] } };

  /**
   * Represents a filter to only include content visible by the given profile role level.
   *
   * @param {ProfileRoleLevel} level - The profile role level to use for filtering.
   * @returns {FilterQuery<Content>} - The search filter query.
   */
  static VISIBILITY: (level: ProfileRoleLevel) => FilterQuery<Content> = (
    level: ProfileRoleLevel
  ) => ({
    'meta.visibility': { $gte: level },
  });

  /**
   * Filters the content based on the provided DocumentIdentity.
   *
   * @param {DocumentIdentity<Content>} cid - The DocumentIdentity that will be used to filter the content.
   * @returns {FilterQuery<Content>} - The filter query object with the specified _id.
   */
  static cid(cid: DocumentIdentity<Content>): FilterQuery<Content> {
    return { _id: assureObjectId(cid) };
  }

  /**
   * Returns a filter query condition based on the given archived flag.
   *
   * @param {boolean} archived - Specifies whether to filter by archived or not archived content.
   * @return {FilterQuery<Content>} The filter query condition based on the archived flag. If archived is true, it returns the condition for archived content, otherwise it returns the condition for not archived content.
   */
  static archived(archived: boolean): FilterQuery<Content> {
    return archived ? ContentCondition.ARCHIVED : ContentCondition.NOT_ARCHIVED;
  }

  /**
   * Retrieves a filter query for content visible for the given profile role level.
   *
   * @param {ProfileRoleLevel} level - The visibility level to filter by.
   * @return {FilterQuery<Content>} - The filter query for content with the specified visibility level.
   */
  static visibility(level: ProfileRoleLevel): FilterQuery<Content> {
    return ContentCondition.VISIBILITY(level);
  }

  /**
   * Returns a filter query object that filters documents based on the provided milestone ID.
   *
   * @param {DocumentIdentity<any>} mid - The milestone ID to filter documents by.
   * @return {FilterQuery<Content>} A filter query object that can be used to query documents with the specified milestone ID.
   */
  static milestone(mid: DocumentIdentity<any>): FilterQuery<Content> {
    return { 'meta.mid': assureObjectId(mid) };
  }

  /**
   * Returns a FilterQuery object that filters Content documents based on the given array of DocumentIdentity objects.
   *
   * @param {DocumentIdentity<any>[]} mids - An array of DocumentIdentity objects containing the IDs to filter by.
   * @returns {FilterQuery<Content>} - A FilterQuery object that can be used to filter Content documents.
   */
  static withMilestones(mids: DocumentIdentity<any>[]): FilterQuery<Content> {
    return { 'meta.mid': { $in: mids.map((mid) => assureObjectId(mid)) } };
  }
}

/**
 * Builds a query object for content filtering.
 *
 * @param {TFilter} filter - The filter object containing the filter criteria.
 *
 * @return {FilterQuery<T> | undefined} - The MongoDB query object that can be used for content filtering or undefined if `filter` is empty.
 */
export function buildContentFilterQuery<
  T extends Content = Content,
  TFilter extends IContentSearchFilter = IContentSearchFilter,
>(filter?: TFilter): FilterQuery<T> | undefined {
  if (!filter) return undefined;

  const conditions = [
    isNotNil(filter.cid) ? ContentCondition.cid(filter.cid!) : null,
    isNotNil(filter.archived) ? ContentCondition.archived(filter.archived!) : null,
    isNotNil(filter.roleLevel) ? ContentCondition.visibility(filter.roleLevel!) : null,
  ];

  if (isNotNil(filter.conditions)) {
    conditions.push(...filter.conditions.filter((c) => isNotNil(c)));
  }

  return DBQuery.and(conditions);
}

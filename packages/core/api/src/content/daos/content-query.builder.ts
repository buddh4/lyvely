import { FilterQuery, assureObjectId, DocumentIdentity, DBQuery } from '@/core';
import { Content } from '../schemas/content.schema';
import { ProfileRoleLevel } from '@lyvely/interface';
import { IContentSearchFilter } from './content-search-filter.interface';
import { isNotNil } from '@lyvely/common';
import { Profile, Tag } from '@/profiles';
import { isMongoId } from 'class-validator';

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
  static NOT_ARCHIVED: FilterQuery<Content> = { 'meta.archived': { $ne: true } };

  /**
   * Represents a filter query for retrieving deleted content.
   *
   * @type {FilterQuery<Content>}
   * @constant
   */
  static DELETED: FilterQuery<Content> = { 'meta.deleted': true };

  /**
   * Represents a filter query for non-deleted content.
   *
   * @type {FilterQuery<Content>}
   */
  static NOT_DELETED: FilterQuery<Content> = { 'meta.deleted': { $in: [null, false] } };

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
   * Filters the content based on the provided profile id.
   *
   * @param {DocumentIdentity<Content>} pid - The DocumentIdentity of the contents' profile.
   * @returns {FilterQuery<Content>} - The filter query object with the specified pid.
   */
  static pid(pid: DocumentIdentity<Profile>): FilterQuery<Content> {
    return { pid: assureObjectId(pid) };
  }

  /**
   * Filters the content based on the provided organization id.
   *
   * @param {DocumentIdentity<Content>} oid - The DocumentIdentity of the contents' organization.
   * @returns {FilterQuery<Content>} - The filter query object with the specified oid.
   */
  static oid(oid: DocumentIdentity<Profile>): FilterQuery<Content> {
    return { oid: assureObjectId(oid) };
  }

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
   * Filters the content based on the provided type.
   *
   * @param {DocumentIdentity<Content>} type - The content type.
   * @returns {FilterQuery<Content>} - The filter query object with the specified type.
   */
  static type(type: string): FilterQuery<Content> {
    return { type };
  }

  /**
   * Filters content based on the provided parentId DocumentIdentity.
   *
   * @param {DocumentIdentity<Content>} parentId - The DocumentIdentity of the parent content document.
   * @returns {FilterQuery<Content>} - The filter query object with the specified 'parentId' filter.
   */
  static parentId(parentId: DocumentIdentity<Content>): FilterQuery<Content> {
    return { 'meta.parentId': assureObjectId(parentId) };
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
   * Returns a filter query condition based on the given deleted flag.
   *
   * @param {boolean} deleted - Specifies whether to filter by deleted or not deleted content.
   * @return {FilterQuery<Content>} The filter query condition based on the deleted flag. If deleted is true, it returns the condition for deleted content, otherwise it returns the condition for not deleted content.
   */
  static deleted(deleted: boolean): FilterQuery<Content> {
    return deleted ? ContentCondition.DELETED : ContentCondition.NOT_DELETED;
  }

  /**
   * Constructs a filter query object based on the provided text query string.
   *
   * @param {string} query - The query string to perform the search on.
   *
   * @return {FilterQuery<Content>} - The filter query object containing the $text operator with the $search parameter.
   */
  static query(query: string): FilterQuery<Content> {
    return { $text: { $search: query } };
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

  /**
   * Returns a content tag id filter.
   *
   * @param {DocumentIdentity<Tag>} tagIds - The parameter containing the necessary data for retrieval.
   * @returns {FilterQuery<Content>} - A FilterQuery object with tag id condition.
   */
  static tagIds(tagIds: DocumentIdentity<Tag>[]): FilterQuery<Content> {
    return { tagIds: { $all: tagIds.map((tid) => assureObjectId(tid)) } };
  }
}

/**
 * Builds a query object for content filtering.
 *
 * @param {TFilter} filter - The filter object containing the filter criteria.
 *
 * @return {FilterQuery<T> | undefined} - The MongoDB query object that can be used for content filtering or undefined if `filter` is empty.
 */
export function buildContentFilterQuery(filter: undefined): undefined;
export function buildContentFilterQuery<T extends Content = Content>(
  filter: IContentSearchFilter
): FilterQuery<T>;
export function buildContentFilterQuery<T extends Content = Content>(
  filter?: IContentSearchFilter
): FilterQuery<T> | undefined {
  if (!filter) return undefined;

  if (isMongoId(filter.query?.trim())) {
    filter.cid = filter.query!.trim();
    delete filter.query;
  }

  const conditions = [
    isNotNil(filter.pid) ? ContentCondition.pid(filter.pid) : null,
    isNotNil(filter.oid) ? ContentCondition.oid(filter.oid) : null,
    isNotNil(filter.cid) ? ContentCondition.cid(filter.cid) : null,
    isNotNil(filter.type) ? ContentCondition.type(filter.type) : null,
    isNotNil(filter.tagIds) ? ContentCondition.tagIds(filter.tagIds) : null,
    isNotNil(filter.parentId) ? ContentCondition.parentId(filter.parentId) : null,
    isNotNil(filter.archived) ? ContentCondition.archived(filter.archived) : null,
    isNotNil(filter.deleted) ? ContentCondition.deleted(filter.deleted) : null,
    isNotNil(filter.query) ? ContentCondition.query(filter.query) : null,
    isNotNil(filter.roleLevel) ? ContentCondition.visibility(filter.roleLevel) : null,
  ].filter((c) => isNotNil(c));

  if (isNotNil(filter.conditions)) {
    conditions.push(...filter.conditions.filter((c) => isNotNil(c)));
  }

  return DBQuery.and(conditions);
}

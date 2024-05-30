import { FilterQuery, assureObjectId, DocumentIdentity, DBQuery } from '@/core';
import { Content } from '../schemas/content.schema';
import { ProfileRoleLevel } from '@lyvely/interface';
import { IContentSearchFilter } from './content-search-filter.interface';
import { isNotNil } from '@lyvely/common';

export class ContentCondition {
  static ARCHIVED: FilterQuery<Content> = { 'meta.archived': true };
  static NOT_ARCHIVED: FilterQuery<Content> = { 'meta.archived': { $in: [null, false] } };
  static VISIBILITY: (level: ProfileRoleLevel) => FilterQuery<Content> = (
    level: ProfileRoleLevel
  ) => ({
    'meta.visibility': { $lte: level },
  });

  static cid(cid: DocumentIdentity<Content>): FilterQuery<Content> {
    return { _id: assureObjectId(cid) };
  }

  static archived(archived: boolean): FilterQuery<Content> {
    return archived ? ContentCondition.ARCHIVED : ContentCondition.NOT_ARCHIVED;
  }

  static visibility(level: ProfileRoleLevel): FilterQuery<Content> {
    return ContentCondition.VISIBILITY(level);
  }

  static milestone(mid: DocumentIdentity<any>): FilterQuery<Content> {
    return { 'meta.mid': assureObjectId(mid) };
  }

  static withMilestones(mids: DocumentIdentity<any>[]): FilterQuery<Content> {
    return { 'meta.mid': { $in: mids.map((mid) => assureObjectId(mid)) } };
  }
}

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
    conditions.push(...filter.conditions);
  }

  return DBQuery.and(conditions);
}

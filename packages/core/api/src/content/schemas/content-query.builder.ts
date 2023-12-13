import { FilterQuery, assureObjectId, DocumentIdentity } from '@/core';
import { Content } from './content.schema';

export class ContentCondition {
  static ARCHIVED: FilterQuery<Content> = { 'meta.archived': true };
  static NOT_ARCHIVED: FilterQuery<Content> = { 'meta.archived': { $in: [null, false] } };

  static cid(cid: DocumentIdentity<Content>): FilterQuery<Content> {
    return { _id: assureObjectId(cid) };
  }

  static archived(archived: boolean): FilterQuery<Content> {
    return archived ? ContentCondition.ARCHIVED : ContentCondition.NOT_ARCHIVED;
  }

  static milestone(mid: DocumentIdentity<any>): FilterQuery<Content> {
    return { 'meta.mid': assureObjectId(mid) };
  }

  static withMilestones(mids: DocumentIdentity<any>[]): FilterQuery<Content> {
    return { 'meta.mid': { $in: mids.map((mid) => assureObjectId(mid)) } };
  }
}

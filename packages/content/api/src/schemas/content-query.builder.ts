import { FilterQuery } from 'mongoose';
import { Content } from './content.schema';
import { assureObjectId, EntityIdentity } from '@lyvely/core';

export class ContentCondition {
  static ARCHIVED: FilterQuery<Content> = { 'meta.archived': true };
  static NOT_ARCHIVED: FilterQuery<Content> = { 'meta.archived': { $in: [null, false] } };

  static cid(cid: EntityIdentity<Content>): FilterQuery<Content> {
    return { _id: assureObjectId(cid) };
  }

  static archived(archived: boolean): FilterQuery<Content> {
    return archived ? ContentCondition.ARCHIVED : ContentCondition.NOT_ARCHIVED;
  }

  static milestone(mid: EntityIdentity<any>): FilterQuery<Content> {
    return { 'meta.mid': assureObjectId(mid) };
  }

  static withMilestones(mids: EntityIdentity<any>[]): FilterQuery<Content> {
    return { 'meta.mid': { $in: mids.map((mid) => assureObjectId(mid)) } };
  }
}

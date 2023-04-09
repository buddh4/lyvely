import { FilterQuery } from 'mongoose';
import { Content } from '@/content';

export class ContentCondition {
  static ARCHIVED: FilterQuery<Content> = { 'meta.archived': true };
  static NOTARCHIVED: FilterQuery<Content> = { 'meta.archived': { $in: [null, false] } };

  static or(conditions: FilterQuery<Content>[]): FilterQuery<Content> {
    return { $or: Object.assign({}, ...conditions) };
  }

  static and(conditions: FilterQuery<Content>[]): FilterQuery<Content> {
    return Object.assign({}, ...conditions);
  }

  static archived(archived: boolean): FilterQuery<Content> {
    return archived ? ContentCondition.ARCHIVED : ContentCondition.NOTARCHIVED;
  }

  static milestone(mid: TObjectId): FilterQuery<Content> {
    return { 'meta.mid': mid };
  }

  static inMilestones(mid: TObjectId[]): FilterQuery<Content> {
    return { 'meta.mid': { $in: mid } };
  }
}

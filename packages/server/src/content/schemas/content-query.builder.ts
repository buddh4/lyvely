import { FilterQuery } from 'mongoose';
import { Content } from './content.schema';

export class ContentCondition {
  static ARCHIVED: FilterQuery<Content> = { 'meta.archived': true };
  static NOTARCHIVED: FilterQuery<Content> = { 'meta.archived': { $in: [null, false] } };

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

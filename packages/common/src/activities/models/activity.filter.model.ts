import { ActivityType, ActivityModel } from './activity.model';
import { ContentFilter, IContentFilterOptions } from '@/content';

export interface IActivityFilterOptions extends IContentFilterOptions {
  type?: ActivityType;
}

export class ActivityFilter extends ContentFilter<ActivityModel, IActivityFilterOptions> {}

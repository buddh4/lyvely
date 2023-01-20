import { ActivityModel } from './activity.model';
import { ContentFilter, IContentFilterOptions } from '@/content';

export interface IActivityFilterOptions extends IContentFilterOptions {
  type?: string;
}

export class ActivityFilter extends ContentFilter<ActivityModel, IActivityFilterOptions> {}

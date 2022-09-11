import { ActivityType } from "./activity.model";
import { ContentFilter, ContentFilterOptions } from '../../content';
import { ActivityModel } from "./activity.model";

export interface ActivityFilterOptions extends ContentFilterOptions {
  type?: ActivityType;
}

export class ActivityFilter extends ContentFilter<ActivityModel, ActivityFilterOptions> {}

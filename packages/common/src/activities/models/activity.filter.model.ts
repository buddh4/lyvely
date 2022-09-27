import { ActivityType, ActivityModel } from "./activity.model";
import { ContentFilter, ContentFilterOptions } from "@/content";

export interface ActivityFilterOptions extends ContentFilterOptions {
  type?: ActivityType;
}

export class ActivityFilter extends ContentFilter<ActivityModel, ActivityFilterOptions> {}

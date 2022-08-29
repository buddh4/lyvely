import { IActivity, ActivityType } from '../interfaces';
import { ContentFilter, ContentFilterOptions } from '../../content';

export interface ActivityFilterOptions extends ContentFilterOptions {
  type?: ActivityType;
}

export class ActivityFilter extends ContentFilter<IActivity<string>, ActivityFilterOptions> {}

import { ContentFilter, IContentFilterOptions } from '@lyvely/content';
import { MilestoneModel } from './milestone.model';

export interface IMilestoneFilterOptions extends IContentFilterOptions {}

export class MilestoneFilter extends ContentFilter<MilestoneModel, IMilestoneFilterOptions> {}

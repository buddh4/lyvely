import { ContentFilter, IContentSearchQuery } from '@lyvely/interface';
import { MilestoneModel } from './milestone.model';

export interface IMilestoneFilterOptions extends IContentSearchQuery {}

export class MilestoneFilter extends ContentFilter<MilestoneModel, IMilestoneFilterOptions> {}

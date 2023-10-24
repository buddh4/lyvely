import { ContentFilter, IContentFilterOptions } from '@lyvely/core-interface';
import { MilestoneModel } from './milestone.model';

export interface IMilestoneFilterOptions extends IContentFilterOptions {}

export class MilestoneFilter extends ContentFilter<MilestoneModel, IMilestoneFilterOptions> {}

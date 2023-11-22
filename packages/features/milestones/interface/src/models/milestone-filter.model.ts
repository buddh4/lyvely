import { ContentFilter, IContentFilterOptions } from '@lyvely/interface';
import { MilestoneModel } from './milestone.model';

export interface IMilestoneFilterOptions extends IContentFilterOptions {}

export class MilestoneFilter extends ContentFilter<MilestoneModel, IMilestoneFilterOptions> {}

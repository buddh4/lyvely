import { ContentFilter, IContentSearchQuery } from '@lyvely/interface';
import { HabitModel } from './habit.model';

export interface IHabitFilterOptions extends IContentSearchQuery {}

export class HabitFilter extends ContentFilter<HabitModel, IHabitFilterOptions> {}

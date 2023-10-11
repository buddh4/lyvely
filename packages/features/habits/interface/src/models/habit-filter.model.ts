import { ContentFilter, IContentFilterOptions } from '@lyvely/core-interface';
import { HabitModel } from './habit.model';

export interface IHabitFilterOptions extends IContentFilterOptions {}

export class HabitFilter extends ContentFilter<HabitModel, IHabitFilterOptions> {}

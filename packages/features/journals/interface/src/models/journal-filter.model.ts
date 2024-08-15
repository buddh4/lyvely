import { JournalModel } from './journal.model';
import { ContentFilter, IContentSearchQuery } from '@lyvely/interface';

export interface IJournalFilterOptions extends IContentSearchQuery {}

export class JournalFilter extends ContentFilter<JournalModel, IJournalFilterOptions> {}

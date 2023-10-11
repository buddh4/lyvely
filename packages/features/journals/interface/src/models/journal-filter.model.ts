import { JournalModel } from './journal.model';
import { ContentFilter, IContentFilterOptions } from '@lyvely/core-interface';

export interface IJournalFilterOptions extends IContentFilterOptions {}

export class JournalFilter extends ContentFilter<JournalModel, IJournalFilterOptions> {}

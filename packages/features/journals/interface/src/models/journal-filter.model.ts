import { JournalModel } from './journal.model';
import { ContentFilter, IContentFilterOptions } from '@lyvely/interface';

export interface IJournalFilterOptions extends IContentFilterOptions {}

export class JournalFilter extends ContentFilter<JournalModel, IJournalFilterOptions> {}

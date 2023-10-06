import { JournalModel } from './journal.model';
import { ContentFilter, IContentFilterOptions } from '@lyvely/content-interface';

export interface IJournalFilterOptions extends IContentFilterOptions {}

export class JournalFilter extends ContentFilter<JournalModel, IJournalFilterOptions> {}

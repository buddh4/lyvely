import { JournalModel } from './journal.model';
import { ContentFilter, IContentFilterOptions } from '@/content';

export interface IJournalFilterOptions extends IContentFilterOptions {}

export class JournalFilter extends ContentFilter<JournalModel, IJournalFilterOptions> {}

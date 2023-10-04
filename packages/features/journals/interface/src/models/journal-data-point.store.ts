import { JournalModel } from './journal.model';
import { TimeSeriesStore } from '@lyvely/time-series-interface';

export class JournalDataPointStore extends TimeSeriesStore<JournalModel> {}

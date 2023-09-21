import { JournalModel } from './journal.model';
import { TimeSeriesStore } from '@/time-series';

export class JournalDataPointStore extends TimeSeriesStore<JournalModel> {}

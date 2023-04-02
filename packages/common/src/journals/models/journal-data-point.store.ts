import { JournalModel } from './journal.model';
import { TimeSeriesDataPointStore } from '@/time-series';

export class JournalDataPointStore extends TimeSeriesDataPointStore<JournalModel> {}

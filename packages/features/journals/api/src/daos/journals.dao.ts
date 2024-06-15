import { Journal } from '../schemas';
import { TimeSeriesContentDao } from '@lyvely/time-series';
import { Dao } from '@lyvely/api';

@Dao(Journal)
export class JournalsDao extends TimeSeriesContentDao<Journal> {}

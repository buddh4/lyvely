import { Journal } from '../schemas';
import { TimeSeriesContentDao } from '@lyvely/time-series';
import { ProfileDao } from '@lyvely/api';

@ProfileDao(Journal)
export class JournalsDao extends TimeSeriesContentDao<Journal> {}

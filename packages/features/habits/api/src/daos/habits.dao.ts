import { Habit } from '../schemas';
import { ProfileDao } from '@lyvely/api';
import { TimeSeriesContentDao } from '@lyvely/time-series';

@ProfileDao(Habit)
export class HabitsDao extends TimeSeriesContentDao<Habit> {}

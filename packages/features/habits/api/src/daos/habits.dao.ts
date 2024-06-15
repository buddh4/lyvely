import { Habit } from '../schemas';
import { Dao } from '@lyvely/api';
import { TimeSeriesContentDao } from '@lyvely/time-series';

@Dao(Habit)
export class HabitsDao extends TimeSeriesContentDao<Habit> {}

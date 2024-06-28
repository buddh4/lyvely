import { AbstractDataPointDao, DataPointDao } from '@lyvely/time-series';
import { Habit, HabitDataPoint } from '../schemas';

@DataPointDao({ content: Habit })
export class HabitDataPointDao extends AbstractDataPointDao<HabitDataPoint> {}

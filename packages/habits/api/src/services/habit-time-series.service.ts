import { Injectable, Inject } from '@nestjs/common';
import { Habit } from '../schemas';
import { HabitsDao } from '../daos';
import { TimeSeriesService } from '@lyvely/time-series';
import { HabitDataPointService } from './habit-data-point.service';

@Injectable()
export class HabitTimeSeriesService extends TimeSeriesService<Habit> {
  @Inject()
  protected contentDao: HabitsDao;

  @Inject()
  protected dataPointService: HabitDataPointService;
}

import { Injectable, Inject } from '@nestjs/common';
import { Habit } from '../schemas';
import { HabitsDao } from '../daos';
import { NumberDataPoint, TimeSeriesContentService } from '@/time-series';
import { HabitDataPointService } from './habit-data-point.service';

@Injectable()
export class HabitTimeSeriesService extends TimeSeriesContentService<Habit, NumberDataPoint> {
  @Inject()
  protected contentDao: HabitsDao;

  @Inject()
  protected dataPointService: HabitDataPointService;
}

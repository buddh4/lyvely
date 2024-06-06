import { TimerDataPointService } from '@lyvely/time-series';
import { Inject, Injectable } from '@nestjs/common';
import { HabitDataPointService } from './habit-data-point.service';
import { Habit, type HabitDataPoint } from '../schemas';

@Injectable()
export class HabitDataPointTimerService extends TimerDataPointService<Habit, HabitDataPoint> {
  @Inject()
  dataPointService: HabitDataPointService;
}

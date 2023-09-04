import { TimerDataPointService } from '@lyvely/time-series';
import { Inject, Injectable } from '@nestjs/common';
import { HabitDataPointService } from './habit-data-point.service';

@Injectable()
export class HabitDataPointTimerService extends TimerDataPointService {
  @Inject()
  dataPointService: HabitDataPointService;
}

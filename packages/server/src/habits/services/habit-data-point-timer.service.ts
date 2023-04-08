import { TimerDataPointService } from '@/time-series';
import { Inject, Injectable } from '@nestjs/common';
import { HabitDataPointService } from '@/habits';

@Injectable()
export class HabitDataPointTimerService extends TimerDataPointService {
  @Inject()
  dataPointService: HabitDataPointService;
}

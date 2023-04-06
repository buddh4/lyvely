import { TimerDataPointService } from '@/time-series/services';
import { TestDataPointService } from '@/time-series/test/test-data-point.service';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class TestTimerDataPointService extends TimerDataPointService {
  @Inject()
  dataPointService: TestDataPointService;
}

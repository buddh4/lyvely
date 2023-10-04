import { TimerDataPointService } from '../services';
import { TestDataPointService } from './test-data-point.service';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class TestTimerDataPointService extends TimerDataPointService {
  @Inject()
  dataPointService: TestDataPointService;
}

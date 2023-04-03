import { Injectable, Inject } from '@nestjs/common';
import { DataPointService, NumberDataPoint, NumberDataPointService } from '@/time-series';
import {
  TestNumberTimeSeriesContent,
  TestTimeSeriesContent,
} from './test-time-series-content.schema';
import { TestNumberDataPointDao } from './test-number-data-point.dao';

@Injectable()
export class TestDataPointService extends DataPointService<TestTimeSeriesContent, NumberDataPoint> {
  @Inject()
  protected dataPointDao: TestNumberDataPointDao;
}

@Injectable()
export class TestNumberDataPointService extends NumberDataPointService<TestNumberTimeSeriesContent> {
  @Inject()
  protected dataPointDao: TestNumberDataPointDao;
}

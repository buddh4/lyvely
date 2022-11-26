import { TestDataPoint, TestNumberDataPoint } from './test-data-point.schema';
import { Injectable, Inject } from '@nestjs/common';
import { DataPointService, NumberDataPointService } from '@/time-series';
import { TestNumberTimeSeriesContent, TestTimeSeriesContent } from './test-time-series-content.schema';
import { TestNumberDataPointDao } from './test-number-data-point.dao';

@Injectable()
export class TestDataPointService extends DataPointService<TestTimeSeriesContent, TestDataPoint> {
  @Inject()
  protected dataPointDao: TestNumberDataPointDao;

  protected updateDataPointValue() {
    // Nothing todo...
  }
}

@Injectable()
export class TestNumberDataPointService extends NumberDataPointService<
  TestNumberTimeSeriesContent,
  TestNumberDataPoint
> {
  @Inject()
  protected dataPointDao: TestNumberDataPointDao;
}

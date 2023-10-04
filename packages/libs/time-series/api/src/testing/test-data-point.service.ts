import { Injectable, Inject } from '@nestjs/common';
import { DataPointService } from '../';
import { TestTimeSeriesContent } from './test-time-series-content.schema';
import { TestDataPointDao } from './test-data-point.dao';

@Injectable()
export class TestDataPointService extends DataPointService<TestTimeSeriesContent> {
  @Inject()
  protected dataPointDao: TestDataPointDao;
}

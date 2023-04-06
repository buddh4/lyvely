import { Inject, Injectable } from '@nestjs/common';
import { TimeSeriesService } from '@/time-series';
import { TestTimeSeriesContent } from './test-time-series-content.schema';
import { TestTimeSeriesContentDao } from '@/time-series/test/test-time-series-content.dao';
import { TestDataPointService } from '@/time-series/test/test-data-point.service';

@Injectable()
export class TestTimeSeriesService extends TimeSeriesService<TestTimeSeriesContent> {
  @Inject()
  protected contentDao: TestTimeSeriesContentDao;

  @Inject()
  protected dataPointService: TestDataPointService;
}

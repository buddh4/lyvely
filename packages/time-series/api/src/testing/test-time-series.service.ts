import { Inject, Injectable } from '@nestjs/common';
import { TimeSeriesService } from '../';
import { TestTimeSeriesContent } from './test-time-series-content.schema';
import { TestTimeSeriesContentDao } from './test-time-series-content.dao';
import { TestDataPointService } from './test-data-point.service';

@Injectable()
export class TestTimeSeriesService extends TimeSeriesService<TestTimeSeriesContent> {
  @Inject()
  protected contentDao: TestTimeSeriesContentDao;

  @Inject()
  protected dataPointService: TestDataPointService;
}

import { Inject, Injectable } from '@nestjs/common';
import { TimeSeriesValueAggregationService } from '@lyvely/time-series';
import { JournalDataPointDao } from '../daos';

@Injectable()
export class JournalValueAggregationService extends TimeSeriesValueAggregationService {
  @Inject()
  protected override dataPointDao: JournalDataPointDao;
}

import { Inject, Injectable } from '@nestjs/common';
import { TimeSeriesValueAggregationService } from '@lyvely/time-series';
import { HabitDataPointDao } from '../daos';

@Injectable()
export class HabitValueAggregationService extends TimeSeriesValueAggregationService {
  @Inject()
  protected override dataPointDao: HabitDataPointDao;
}

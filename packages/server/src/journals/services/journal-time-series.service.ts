import { Injectable, Inject } from '@nestjs/common';
import { JournalsDao } from '../daos';
import { Journal } from '../schemas';
import { TimeSeriesService } from '@/time-series/services/time-series.service';
import { JournalDataPointService } from '@/journals/services/journal-data-point.service';

@Injectable()
export class JournalTimeSeriesService extends TimeSeriesService<Journal> {
  @Inject()
  protected contentDao: JournalsDao;

  @Inject()
  protected dataPointService: JournalDataPointService;
}

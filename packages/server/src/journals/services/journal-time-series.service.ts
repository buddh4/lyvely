import { Injectable, Inject } from '@nestjs/common';
import { JournalsDao } from '../daos';
import { Journal } from '../schemas';
import { TimeSeriesContentService } from '@/time-series/services/time-series-content.service';
import { JournalDataPointService } from '@/journals/services/journal-data-point.service';

@Injectable()
export class JournalTimeSeriesService extends TimeSeriesContentService<Journal> {
  @Inject()
  protected contentDao: JournalsDao;

  @Inject()
  protected dataPointService: JournalDataPointService;
}

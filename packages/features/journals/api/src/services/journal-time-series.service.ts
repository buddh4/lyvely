import { Injectable, Inject } from '@nestjs/common';
import { JournalsDao } from '../daos';
import { Journal } from '../schemas';
import { TimeSeriesService } from '@lyvely/time-series';
import { JournalDataPointService } from './journal-data-point.service';

@Injectable()
export class JournalTimeSeriesService extends TimeSeriesService<Journal> {
  @Inject()
  protected contentDao: JournalsDao;

  @Inject()
  protected dataPointService: JournalDataPointService;
}

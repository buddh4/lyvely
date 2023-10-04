import { Injectable, Inject } from '@nestjs/common';
import { JournalDataPointDao } from '../daos';
import { DataPointService } from '@lyvely/time-series';
import { Journal, JournalDataPoint } from '../schemas';

@Injectable()
export class JournalDataPointService extends DataPointService<Journal, JournalDataPoint> {
  @Inject()
  protected dataPointDao: JournalDataPointDao;
}

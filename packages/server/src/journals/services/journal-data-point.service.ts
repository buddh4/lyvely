import { Injectable, Inject } from '@nestjs/common';
import { JournalDataPointDao } from '../daos';
import { DataPointService } from '@/time-series';
import { Journal, JournalDataPoint } from '@/journals/schemas';

@Injectable()
export class JournalDataPointService extends DataPointService<Journal, JournalDataPoint> {
  @Inject()
  protected dataPointDao: JournalDataPointDao;
}

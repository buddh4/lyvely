import { Inject, Injectable } from '@nestjs/common';
import { NumberDataPointService } from '@/time-series';
import { JournalNumberDataPointDao } from '../daos';

@Injectable()
export class JournalNumberDataPointService extends NumberDataPointService {
  @Inject()
  protected dataPointDao: JournalNumberDataPointDao;
}

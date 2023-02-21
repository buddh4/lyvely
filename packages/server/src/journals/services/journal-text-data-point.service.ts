import { Inject, Injectable } from '@nestjs/common';
import { TextDataPointService } from '@/time-series';
import { JournalTextDataPointDao } from '../daos';

@Injectable()
export class JournalTextDataPointService extends TextDataPointService {
  @Inject()
  protected dataPointDao: JournalTextDataPointDao;
}

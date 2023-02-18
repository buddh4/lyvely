import { Inject, Injectable } from '@nestjs/common';
import {
  NumberDataPointService,
  NumberTimeSeriesContent,
  TextDataPointService,
} from '@/time-series';
import { JournalNumberDataPoint } from '../schemas';
import { JournalNumberDataPointDao, JournalTextDataPointDao } from '../daos';

@Injectable()
export class JournalTextDataPointService extends TextDataPointService {
  @Inject()
  protected dataPointDao: JournalTextDataPointDao;
}

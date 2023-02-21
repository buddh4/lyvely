import { Injectable, Inject } from '@nestjs/common';
import { JournalDataPointDao } from '../daos';
import { DataPointService } from '@/time-series';
import { Journal, JournalDataPoint } from '@/journals/schemas';
import { Profile } from '@/profiles';
import { User } from '@/users';

@Injectable()
export class JournalDataPointService extends DataPointService<Journal, JournalDataPoint> {
  @Inject()
  protected dataPointDao: JournalDataPointDao;

  protected updateDataPointValue(
    profile: Profile,
    user: User,
    dataPoint: JournalDataPoint,
    model: Journal,
    newValue: any,
  ) {}
}

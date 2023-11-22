import { DataPoint, DataPointDao, InjectDataPointModel } from '@lyvely/time-series';
import { Injectable } from '@nestjs/common';
import { Journal } from '../schemas';
import { Model } from '@lyvely/api';

@Injectable()
export class JournalDataPointDao extends DataPointDao {
  @InjectDataPointModel(Journal.name)
  protected model: Model<DataPoint>;

  protected contentName = Journal.name;

  getModuleId(): string {
    return 'journals';
  }
}
